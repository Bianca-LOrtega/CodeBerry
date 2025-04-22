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
  fk_empresa int,
  constraint fk_usuario_empresa foreign key (fk_empresa) references empresa(idTransportadora)
);

-- Tabela motorista

create table motorista (
idMotorista int primary key auto_increment,
nome varchar(60),
telefone char(12)
);

-- Tabela caminhao

create table caminhao (
  idcaminhao int primary key,
  placa char(7),
  statusCaminhao varchar(20),
  fk_empresa int,
  fk_motorista int,
  constraint fk_caminhao_empresa foreign key (fk_empresa) references empresa(idTransportadora),
  constraint fk_caminhao_motorista foreign key (fk_motorista) references motorista(idMotorista),
  constraint ck_statusCaminhao check (statusCaminhao in ('ativo', 'inativo'))
);

-- Tabela lote

create table lote (
  idLote int primary key auto_increment,
  localPartida varchar(45),
  localDestino varchar(45),
  horarioPartida datetime,
  horarioChegada datetime,
  statusLote varchar(40),
  fk_caminhao int,
  constraint fk_lote_caminhao foreign key (fk_caminhao) references caminhao(idcaminhao),
  constraint ck_statusLote check (statusLote in ('iniciado', 'em andamento', 'finalizado'))
);


-- Tabela sensor

create table registros (
  idSensor int primary key,
  contador int,
  nomeSensor varchar(20),
  temperatura decimal(3,1),
  umidade decimal(3,1),
  horario datetime,
  fk_lote int,
  constraint fk_registro_lote foreign key (fk_lote) references lote(idLote)
);


-- inserts para as tabelas: 

insert into empresa (nomeEmpresa, cnpj) values
('TransMorangos Ltda', '123456780001'),
('FrutaTrans Brasil', '987654320001'),
('Logística Berry', '112233440001');

insert into usuario (nomeUsuario, emailUsuario, senhaUsuario, tipoAcesso, fk_empresa) values
('João Silva', 'joao@transmorangos.com', 'senha123', 'admin', 1),
('Maria Oliveira', 'maria@frutatrans.com', 'segura456', 'operador', 2),
('Carlos Souza', 'carlos@logberry.com', '123abc', 'admin', 3);

insert into motorista (nome, telefone) values
('Carlos Silva', '11987654321'),
('Mariana Costa', '21912345678'),
('João Pereira', '31998765432');

insert into caminhao (idcaminhao, placa, statusCaminhao, fk_empresa) values
(101, 'ABC1234', 'ativo', 1),
(102, 'KFL5678', 'ativo', 2),
(103, 'PMG9012', 'inativo', 3);

insert into lote (localPartida, localDestino, horarioPartida, horarioChegada, statusLote, fk_caminhao) values
('São Paulo', 'Campinas', '2025-04-01 08:00:00', '2025-04-01 10:30:00', 'finalizado', 101),
('Campinas', 'Ribeirão Preto', '2025-04-02 09:00:00', '2025-04-02 13:00:00', 'em andamento', 102),
('Ribeirão Preto', 'Franca', '2025-04-03 07:30:00', '2025-04-03 11:00:00', 'iniciado', 101);

insert into registros (idSensor, contador, nomeSensor, temperatura, umidade, horario, fk_lote) values
(201, 1, 'Sensor DHT11', 1.2, 85.3, '2025-04-01 08:15:00', 1),
(202, 1, 'Sensor DHT11', 0.9, 87.0, '2025-04-02 10:45:00', 2),
(203, 1, 'Sensor DHT11', 2.0, 84.1, '2025-04-03 13:52:00', 3);

-- checando os dados

select * from lote;

select * from registros;

select reg.*, lot.* from registros as reg
inner join lote as lot on reg.fk_lote = lot.idLote;