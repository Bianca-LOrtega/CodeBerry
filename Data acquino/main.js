// importa os bibliotecas necessários
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');

// constantes para configurações
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true;

// Variável global para a pool de conexão do banco de dados (inicializada uma vez)
let poolBancoDados;

// Função para inicializar/obter a pool de conexão (garante que seja criada apenas uma vez)
async function getDatabasePool() {
    if (!poolBancoDados) {
        poolBancoDados = mysql.createPool(
            {
                 host: '10.18.32.23',
                user: 'aluno',
                password: 'Sptech#2024',
                database: 'codeberry',
                port: 3307
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
   // A pool de conexão será obtida aqui, garantindo que já esteja pronta.
    const pool = await getDatabasePool();

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

         // Validação e cálculo dos valores dos sensores
        if (valores.length < 2 || isNaN(parseFloat(valores[0])) || isNaN(parseFloat(valores[1]))) {
            console.error("Dados de sensor inválidos ou incompletos recebidos do Arduino. Ignorando.");
            return;
        }
        
        const temperaturaBase = parseFloat(valores[1]);
         const umidadeBase = parseFloat(valores[0]);
        
        // Verificação se os valores são números válidos
        if (isNaN(umidadeBase) || isNaN(temperaturaBase)) {
            console.error("Dados de sensor inválidos (não são números). Ignorando.");
            return;
        }
       

        // Aplicação de variações e arredondamento
        const sensorTemperatura = parseFloat(((temperaturaBase - 20) + (Math.random() * 2 - 1)).toFixed(2));
        const sensorUmidade = parseFloat(((umidadeBase + 15) + (Math.random() * 4 - 2)).toFixed(2));

         const sensorTemperatura5 = parseFloat(((temperaturaBase - 21) + (Math.random() * 2 - 1)).toFixed(2));
        const sensorUmidade5 = parseFloat(((umidadeBase + 15) + (Math.random() * 4 - 2)).toFixed(2));

        // armazena os valores dos sensores nos arrays correspondentes (para os endpoints GET em memoria)
        valoresSensorAnalogico.push(sensorTemperatura);
        valoresSensorDigital.push(sensorUmidade);

        // Limitar o tamanho dos arrays para não consumir muita memória (opcional)
        if (valoresSensorAnalogico.length > 100) valoresSensorAnalogico.shift();
        if (valoresSensorDigital.length > 100) valoresSensorDigital.shift();

        // insere os dados no banco de dados (se habilitado)
        if (HABILITAR_OPERACAO_INSERIR) {
              // INSERÇÃO COM PK COMPOSTA 

            var fk1 = 1;
            var fk2 = 2;
            var fk3 = 3;
            var fk5 = 5;// <--- Este é o ID da viagem que você quer registrar

            try {
                // 1. Obter o próximo contador para a fk_viagem_atual
                const [rows] = await pool.execute(
                    'SELECT COALESCE(MAX(contador), 0) + 1 AS proximo_contador FROM registros WHERE fk_viagem = ?',
                    [fk1]
                );
                const proximoContador = rows[0].proximo_contador;

                // Agora, fazemos a inserção de UM ÚNICO registro com os valores que garantem a unicidade da PK.
                await pool.execute(
                    'INSERT INTO registros (fk_viagem, contador, umidade, temperatura, horario) VALUES (?, ?, ?, ?, current_timestamp());',
                    [fk1, proximoContador, sensorUmidade, sensorTemperatura]
                );
                   console.log(`Dados inseridos para Viagem ${fk1}, Contador ${proximoContador}: Umidade ${sensorUmidade}, Temperatura ${sensorTemperatura}`);

                    await pool.execute(
                    'INSERT INTO registros (fk_viagem, contador, umidade, temperatura, horario) VALUES (?, ?, ?, ?, current_timestamp());',
                    [fk2, proximoContador, sensorUmidade, sensorTemperatura]
                );
                   console.log(`Dados inseridos para Viagem ${fk2}, Contador ${proximoContador}: Umidade ${sensorUmidade}, Temperatura ${sensorTemperatura}`);


                 await pool.execute(
                    'INSERT INTO registros (fk_viagem, contador, umidade, temperatura, horario) VALUES (?, ?, ?, ?, current_timestamp());',
                    [fk3, proximoContador, sensorUmidade, sensorTemperatura]
                );
                console.log(`Dados inseridos para Viagem ${fk3}, Contador ${proximoContador}: Umidade ${sensorUmidade}, Temperatura ${sensorTemperatura}`);

                await pool.execute(
                    'INSERT INTO registros (fk_viagem, contador, umidade, temperatura, horario) VALUES (?, ?, ?, ?, current_timestamp());',
                    [fk5, proximoContador, sensorUmidade5, sensorTemperatura5]
                );
                console.log(`Dados inseridos para Viagem ${fk5}, Contador ${proximoContador}: Umidade ${sensorUmidade}, Temperatura ${sensorTemperatura}`);

            } catch (dbError) {
                if (dbError.code === 'ER_DUP_ENTRY') {
                     console.error("ERRO GRAVE: 'Duplicate entry' ainda ocorre. Verifique ABSOLUTAMENTE que sua tabela 'registros' tem 'PRIMARY KEY (fk_viagem, contador)' e 'contador' NÃO é AUTO_INCREMENT.");
                }
                 
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

     // Garante que a pool de conexão seja criada antes de qualquer operação de DB
    await getDatabasePool();

    
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