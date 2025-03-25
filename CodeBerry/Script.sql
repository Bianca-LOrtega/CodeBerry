CREATE DATABASE CodeBerry;
USE CodeBerry;

CREATE TABLE Cliente(
	id_cliente int primary key auto_increment,
    nomeEmpresa varchar(60) NOT NULL,
    email varchar(60) NOT NULL,
    cnpj char(14),
    telefone varchar(11) NOT NULL,
    senha varchar(60) NOT NULL,
    UNIQUE ix_cnpj (cnpj),
    UNIQUE ix_nome (nomeEmpresa),
    UNIQUE ix_email (email),
    UNIQUE ix_telefone (telefone),
    CONSTRAINT chk_email CHECK(email LIKE '%@%.%')
);

CREATE TABLE Pedido(
	id_pedido int primary key auto_increment,
    id_cliente int,
    dataPedido datetime NOT NULL,
    origem varchar(60) NOT NULL,
    chegada varchar(60) NOT NULL,
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);

CREATE TABLE Sensor(
	id_sensor int primary key auto_increment,
    nomeSensor varchar(40)
);

CREATE TABLE Medicao(
	id_medicao int primary key auto_increment,
    id_pedido int,
    id_sensor int,
    temperatura decimal(10,2) NOT NULL,
    umidade decimal(10,2) NOT NULL,
    datamedicao datetime NOT NULL,
    CONSTRAINT fk_medicao_pedido FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    CONSTRAINT fk_medicao_sensor FOREIGN KEY (id_sensor) REFERENCES Sensor(id_sensor)
);

INSERT INTO Cliente (nomeEmpresa, email, cnpj, telefone, senha)
    VALUES ('Morangos Transporte', 'morangos.trans@gmail.com', '12345678901234', '11911111111', '12345678');

INSERT INTO Cliente (nomeEmpresa, email, cnpj, telefone, senha)
    VALUES ('Berry Transporte', 'berry.trans@gmail.com', '12345678901235', '11911111112', '12345671');

INSERT INTO Cliente (nomeEmpresa, email, cnpj, telefone, senha)
    VALUES ('SPMorangos Transporte', 'spmorangos.trans@gmail.com', '12345678901236', '11911111113', '12345672');


INSERT INTO Pedido (id_cliente, dataPedido, origem, chegada)
    VALUES (1, '2025-03-01 19:00:00', 'São Paulo', 'Minas Gerais');

INSERT INTO Pedido (id_cliente, dataPedido, origem, chegada)
    VALUES (2, '2025-03-02 20:30:00', 'Guarulhos', 'São José dos Campos');

INSERT INTO Pedido (id_cliente, dataPedido, origem, chegada)
    VALUES (3, '2025-03-03 18:35:00', 'Arujá', 'Jacareí');


INSERT INTO Sensor (nomeSensor)
    VALUES ('Sensor 1');

INSERT INTO Sensor (nomeSensor)
    VALUES ('Sensor 2');

INSERT INTO Sensor (nomeSensor)
    VALUES ('Sensor 3');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:00');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:01');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:02');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:03');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:04');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:05');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:06');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:07');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:08');

INSERT INTO Medicao (id_pedido, id_sensor, temperatura, umidade, datamedicao)
    VALUES(1, 1, 0, 90, '2025-03-02 13:00:09');