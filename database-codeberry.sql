create database codeberry;

use codeberry;

-- Tabela empresa

create table empresa (
  idTransportadora int primary key auto_increment,
  nomeEmpresa varchar(80),
  cnpj char(12)
);

-- Tabela usuario

create table usuario (
  idLogin int primary key auto_increment,
  nomeUsuario varchar(80),
  emailUsuario varchar(45),
  senhaUsuario varchar(40),
  tipoAcesso varchar(20),
  empresa_idTransportadora int,
  constraint fk_usuario_empresa foreign key (empresa_idTransportadora) references empresa(idTransportadora)
);


-- Tabela caminhao

create table caminhao (
  idcaminhao int primary key,
  placa char(7),
  statusCaminhao varchar(20),
  empresa_idTransportadora int,
  constraint fk_caminhao_empresa foreign key (empresa_idTransportadora) references empresa(idTransportadora),
  constraint ck_statusCaminhao check (statusCaminhao in ('ativo', 'inativo'))
);


-- Tabela lote

create table lote (
  idLote int primary key auto_increment,
  localPartida varchar(45),
  localDestino varchar(45),
  horarioPartida datetime,
  horarioChegada datetime,
  valorLote decimal(10,2),
  statusLote varchar(40),
  caminhao_idcaminhao int,
  constraint fk_lote_caminhao foreign key (caminhao_idcaminhao) references caminhao(idcaminhao),
  constraint ck_statusLote check (statusLote in ('iniciado', 'em andamento', 'finalizado'))
);


-- Tabela sensor

create table sensor (
  idSensor int primary key,
  nomeSensor varchar(20),
  temperatura decimal(3,1),
  umidade decimal(3,1),
  horario datetime
);


-- Tabela registros

create table registros (
  lote_idLote int,
  sensor_idSensor int,
  primary key (lote_idLote, sensor_idSensor),
  constraint fk_registros_lote foreign key (lote_idLote) references lote(idLote),
  constraint fk_registros_sensor foreign key (sensor_idSensor) references sensor(idSensor)
);


-- inserts para as tabelas: 

insert into empresa (nomeEmpresa, cnpj) values
('TransMorangos Ltda', '123456780001'),
('FrutaTrans Brasil', '987654320001'),
('Logística Berry', '112233440001');

insert into usuario (nomeUsuario, emailUsuario, senhaUsuario, tipoAcesso, empresa_idTransportadora) values
('João Silva', 'joao@transmorangos.com', 'senha123', 'admin', 1),
('Maria Oliveira', 'maria@frutatrans.com', 'segura456', 'operador', 2),
('Carlos Souza', 'carlos@logberry.com', '123abc', 'admin', 3);

insert into caminhao (idcaminhao, placa, statusCaminhao, empresa_idTransportadora) values
(101, 'ABC1234', 'ativo', 1),
(102, 'KFL5678', 'ativo', 2),
(103, 'PMG9012', 'inativo', 3);

insert into lote (localPartida, localDestino, horarioPartida, horarioChegada, valorLote, statusLote, caminhao_idcaminhao) values
('São Paulo', 'Campinas', '2025-04-01 08:00:00', '2025-04-01 10:30:00', 50000.00, 'finalizado', 101),
('Campinas', 'Ribeirão Preto', '2025-04-02 09:00:00', '2025-04-02 13:00:00', 75000.00, 'em andamento', 102),
('Ribeirão Preto', 'Franca', '2025-04-03 07:30:00', '2025-04-03 11:00:00', 20000.00, 'iniciado', 101);

insert into sensor (idSensor, nomeSensor, temperatura, umidade, horario) values
(201, 'Sensor DHT11', 1.2, 85.3, '2025-04-01 08:15:00'),
(202, 'Sensor DHT11', 0.9, 87.0, '2025-04-02 10:45:00'),
(203, 'Sensor DHT11', 2.0, 84.1, '2025-04-03 09:20:00');

insert into registros (lote_idLote, sensor_idSensor) values
(1, 201),
(2, 202),
(3, 203);

-- checando os dados

select * from lote;
select * from registros;