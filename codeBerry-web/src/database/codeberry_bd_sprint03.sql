
create database codeberry;
-- drop database codeberry;
use codeberry;

-- Criando as tabelas.

-- tabela empresa.

create table empresa (
  cnpj char(14) not null,
  nomeempresa varchar(80),
  primary key (cnpj)
);

-- tabela usuario.

create table usuario (
  idlogin int not null auto_increment,
  nomeusuario varchar(80),
  emailusuario varchar(45),
  senhausuario varchar(40),
  tipoacesso varchar(20),
  fk_empresa char(14),

  primary key (idlogin),
  constraint fk_usuario_empresa foreign key (fk_empresa) references empresa (cnpj)
);

-- motorista.

create table motorista (
  idmotorista int not null auto_increment,
  nome varchar(60),
  telefone char(12),
  fk_empresa char(14),
  constraint fk_motorista_empresa foreign key (fk_empresa) references empresa (cnpj),
  primary key (idmotorista)
);

-- tabela caminhão.

create table caminhao (
  idcaminhao int not null,
  placa char(7),
  statuscaminhao varchar(20),
  fk_empresa char(14),
  primary key (idcaminhao),
  constraint fk_caminhao_empresa foreign key (fk_empresa) references empresa (cnpj)
);

-- tabela lote.

create table lote (
  idlote int not null auto_increment,
  localpartida varchar(45),
  localdestino varchar(45),
  horariopartida datetime,
  horariochegada datetime,
  statuslote varchar(40),
  fk_empresa char(14),
  primary key (idlote),
  constraint fk_lote_empresa foreign key (fk_empresa) references empresa (cnpj)
);


-- tabela viagem.

create table viagem (
idviagem int not null auto_increment,
fk_caminhao int,
fk_motorista int,
fk_lote int,
primary key (idviagem),
constraint fk_viagem_caminhao foreign key (fk_caminhao) references caminhao (idcaminhao),
constraint fk_viagem_motorista foreign key (fk_motorista) references motorista (idmotorista),
constraint fk_viagem_lote foreign key (fk_lote) references lote (idlote)
);

-- tabela registros.

create table registros (
fk_viagem int,
contador int auto_increment,
temperatura decimal (3,1),
umidade decimal (3,1),
horario datetime,
primary key (contador),
constraint fk_registros_viagem foreign key (fk_viagem) references viagem (idviagem)
);

-- inserts para as tabelas: 

insert into empresa (nomeempresa, cnpj) values
('CodeBerry', '12345678000199'),
('TransMorangos Ltda', '12345678001301'),
('FrutaTrans Brasil', '98765432000241'),
('Logística Berry', '00112233440001');


insert into usuario (nomeusuario, emailusuario, senhausuario, tipoacesso, fk_empresa) values
('João Silva', 'joao@transmorangos.com', 'senha123', 'admin', '12345678001301'),
('Maria Oliveira', 'maria@frutatrans.com', 'segura456', 'operador', '98765432000241'),
('Carlos Souza', 'carlos@logberry.com', '123abc', 'admin', '00112233440001');

insert into motorista (nome, telefone) values
('Carlos Silva', '11987654321'),
('Mariana Costa', '21912345678'),
('João Pereira', '31998765432');

insert into caminhao (idcaminhao, placa, statuscaminhao, fk_empresa) values
(101, 'ABC1234', 'ativo', '12345678001301'),
(102, 'KFL5678', 'ativo', '98765432000241'),
(103, 'PMG9012', 'inativo', '98765432000241');

insert into lote (localpartida, localdestino, horariopartida, horariochegada, statuslote, fk_empresa) values
('São Paulo', 'Campinas', '2025-04-01 08:00:00', '2025-04-01 10:30:00', 'finalizado', '12345678001301'),
('Campinas', 'Ribeirão Preto', '2025-04-02 09:00:00', '2025-04-02 13:00:00', 'em andamento', '98765432000241'),
('Ribeirão Preto', 'Franca', '2025-04-03 07:30:00', '2025-04-03 11:00:00', 'iniciado', '98765432000241');

insert into viagem (fk_caminhao, fk_motorista, fk_lote) values
(101, 1, 1),
(102, 2, 2),
(103, 3, 3);

insert into viagem (fk_caminhao, fk_motorista, fk_lote) values
(103, 2, 3),
(101, 3, 1),
(102, 1, 2);

insert into registros (fk_viagem, temperatura, umidade, horario) values
(1, 1.2, 85.3, '2025-04-01 08:15:00'),
(2, 0.9, 87.0, '2025-04-02 10:45:00'),
(3, 2.0, 84.1, '2025-04-03 13:52:00');

-- checando os dados

select * from lote;

select * from viagem;

select * from registros;

select reg.*, vi.* from registros as reg
inner join viagem as vi on reg.fk_viagem = vi.idviagem;