// usuarioModel.js
var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n function autenticar():", email, senha);
    var instrucaoSql = `
        SELECT 
            idlogin AS id, 
            nomeusuario AS nome, 
            emailusuario AS email, 
            senhausuario AS senha,
            tipoacesso AS tipo,
            fk_empresa AS cnpj
        FROM usuario 
        WHERE emailusuario = '${email}' AND senhausuario = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, tipo, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n function cadastrar():", nome, email, senha, tipo, fkEmpresa);

    var instrucaoSql = `
        INSERT INTO usuario (nomeusuario, emailusuario, senhausuario, tipoacesso, fk_empresa) 
        VALUES ('${nome}', '${email}', '${senha}', '${tipo}', '${fkEmpresa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};
