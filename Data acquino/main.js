// importa os bibliotecas necessários
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');

// constantes para configurações
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true;

// Variável para armazenar a pool de conexão do banco de dados
let poolBancoDados;

// Função para estabelecer a conexão com o banco de dados
async function conectarBancoDados() {
    if (!poolBancoDados) { // Conecta apenas se a pool ainda não foi criada
        poolBancoDados = mysql.createPool(
            {
                host: '10.18.32.186',
                user: 'aluno',
                password: 'Sptech#2024',
                database: 'codeberry',
                port: 3307,
                waitForConnections: true, // Garante que aguarde por conexões se o pool estiver cheio
                connectionLimit: 10,      // Limite de conexões no pool
                queueLimit: 0             // Sem limite de fila
            }
        ).promise();
        console.log("Pool de conexão com o banco de dados criada.");
    }
    return poolBancoDados;
}


// função para comunicação serial
const serial = async (
    valoresSensorAnalogico,
    valoresSensorDigital,
) => {
    // Conecta-se ao banco de dados (garante que o pool esteja pronto)
    const pool = await conectarBancoDados(); // Use a pool criada globalmente ou fora do .on('data')

    // lista as portas seriais disponíveis e procura pelo Arduino
    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }

    // configura a porta serial com o baud rate especificado
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );

    // evento quando a porta serial é aberta
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });

    // processa os dados recebidos do Arduino
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        console.log("Dado recebido do Arduino: " + data);
        const valores = data.split(';');

        // Validação básica dos dados recebidos
        if (valores.length < 2) {
            console.error("Dados incompletos recebidos do Arduino. Ignorando.");
            return;
        }
        
        const umidadeBase = parseFloat(valores[0]);
        const temperaturaBase = parseFloat(valores[1]);
        
        // Verificação se os valores são números válidos
        if (isNaN(umidadeBase) || isNaN(temperaturaBase)) {
            console.error("Dados de sensor inválidos (não são números). Ignorando.");
            return;
        }

        // Aplicação de variações e arredondamento
        const sensorTemperatura = parseFloat(((temperaturaBase - 21) + (Math.random() * 2 - 1)).toFixed(2));
        const sensorUmidade = parseFloat(((umidadeBase + 23) + (Math.random() * 4 - 2)).toFixed(2));

        // armazena os valores dos sensores nos arrays correspondentes (para os endpoints GET)
        valoresSensorAnalogico.push(sensorTemperatura);
        valoresSensorDigital.push(sensorUmidade);

        // Limitar o tamanho dos arrays para não consumir muita memória (opcional)
        if (valoresSensorAnalogico.length > 100) valoresSensorAnalogico.shift();
        if (valoresSensorDigital.length > 100) valoresSensorDigital.shift();

        // insere os dados no banco de dados (se habilitado)
        if (HABILITAR_OPERACAO_INSERIR) {
            // AQUI ESTÁ A MUDANÇA PRINCIPAL!
            // Você precisa saber qual fk_viagem você quer associar.
            // No seu código original, 'v' ia de 1 a 6. Isso significa que você estava testando
            // com um ID de viagem fixo, ou talvez os dados do Arduino devam indicar a fk_viagem.
            // Para simplicidade, vamos usar um fk_viagem FIXO para teste, mas você precisará
            // de uma forma real de obter o ID da viagem atual do caminhão.
            const fk_viagem_atual = 1; // <--- **ATENÇÃO: Este valor deve ser dinâmico no projeto real!**
                                      // Como obter esse valor? Pelo GPS, ou um ID configurado no Arduino,
                                      // ou ao iniciar uma "viagem" na sua aplicação web.

            try {
                // 1. Obter o próximo contador para a fk_viagem_atual
                const [rows] = await pool.execute(
                    'SELECT COALESCE(MAX(contador), 0) + 1 AS proximo_contador FROM registros WHERE fk_viagem = ?',
                    [fk_viagem_atual]
                );
                const proximoContador = rows[0].proximo_contador;

                // 2. Inserir o registro com o contador calculado
                await pool.execute(
                    'INSERT INTO registros (fk_viagem, contador, umidade, temperatura, horario) VALUES (?, ?, ?, ?, current_timestamp());',
                    [fk_viagem_atual, proximoContador, sensorUmidade, sensorTemperatura]
                );
                console.log(`Dados inseridos para Viagem ${fk_viagem_atual}, Contador ${proximoContador}: Umidade ${sensorUmidade}, Temperatura ${sensorTemperatura}`);

            } catch (dbError) {
                if (dbError.code === 'ER_DUP_ENTRY') {
                    console.error(`Erro de entrada duplicada: ${dbError.sqlMessage}. Isso não deveria acontecer com a lógica de 'MAX(contador)+1' se a PK estiver correta.`);
                } else {
                    console.error(`Erro ao inserir dados no banco de dados: ${dbError.message}`);
                }
                console.error("SQL executado:", dbError.sql);
            }
        }
    });

    // evento para lidar com erros na comunicação serial
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}

// função para criar e configurar o servidor web
const servidor = (
    valoresSensorTemperatura,
    valoresSensorUmidade
) => {
    const app = express();

    // configurações de requisição e resposta
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });

    // inicia o servidor na porta especificada
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });

    // define os endpoints da API para cada tipo de sensor
    app.get('/sensores/analogico', (_, response) => {
        return response.json(valoresSensorTemperatura);
    });
    app.get('/sensores/digital', (_, response) => {
        return response.json(valoresSensorUmidade);
    });
}

// função principal assíncrona para iniciar a comunicação serial e o servidor web
(async () => {
    // arrays para armazenar os valores dos sensores
    const valoresSensorTemperatura = [];
    const valoresSensorUmidade = [];

    // Inicializa a pool de conexão antes de iniciar a comunicação serial
    await conectarBancoDados(); 

    // inicia a comunicação serial
    await serial(
        valoresSensorTemperatura,
        valoresSensorUmidade
    );

    // inicia o servidor web
    servidor(
        valoresSensorTemperatura,
        valoresSensorUmidade
    );
})();