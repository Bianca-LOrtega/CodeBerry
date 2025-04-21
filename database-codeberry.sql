create database codeberry;

use codeberry;

create table cadastro (
idTransportadora int primary key auto_increment,
nomeEmpresa varchar(80),
cnpj char(12),
senha varchar(40)
);

create table usuario (
idLogin int primary key auto_increment,
tipoAcesso varchar(20) default ('Motorista', 'Administrador', 'Cliente')
nomeUsuario varchar(80),
emailUsuario varchar(45),
senhaUsuario varchar(40),
fk_transportadora int,
foreign key (fk_transportadora) references cadastro(idTransportadora)
);

create table lote (
	idLote int primary key auto_increment,
    rastreamentoVeiculo varchar(45),
    localPartida varchar (45),
    localDestino varchar(45),
    dataPedido datetime,
    fk_empresa_transporte int,
    foreign key (fk_empresa_transporte) references cadastro(idTransportadora)
);

create table monitoramento (
	idSensor int PRIMARY KEY auto_increment,
    nomeSensor varchar(20),
    fk_lote int,
    foreign key (fk_lote) references lote(idLote)
);

create table Caminhao (
	idCaminhao int PRIMARY KEY auto_increment,
    nomeMotorista varchar(20),
    placa char(8)
    estatos varchar(50) default ('Ativo', 'Inativo')
    fk_usuario int,
    foreign key (fk_usuario) references usuario(idUsuario)
);

create table registros (
	idRegistro int PRIMARY KEY auto_increment,
    temperatura decimal(3, 1),
    umidade decimal(3, 1),
    horario datetime,
    fk_sensor int,
    foreign key (fk_sensor) references monitoramento(idSensor)
);


insert into cadastro (nomeEmpresa, cnpj, senha) values ('empresa1', '353498561847', '123456');
insert into cadastro (nomeEmpresa, cnpj, senha) values ('empresa2', '353498549237', '098765');
insert into lote (rastreamentoVeiculo, localPartida, localDestino, dataPedido, fk_empresa_transporte) values ('caminhao1', 'Minas gerais', 'Sao Paulo', '2025-04-19 18:30:00', 1);
insert into monitoramento (nomeSensor) value ('sensor 1');

insert into registros (temperatura, umidade, horario, fk_sensor, fk_idLote, fk_transporte) values (4.5, 94.2, '14:13:58', 1, 1, 1);
insert into registros (temperatura, umidade, horario, fk_sensor, fk_idLote, fk_transporte) values (4.6, 94.7, '14:13:59', 1, 1, 1);
insert into registros (temperatura, umidade, horario, fk_sensor, fk_idLote, fk_transporte) values (4.2, 94.6, '14:14:00', 1, 1, 1);
insert into registros (temperatura, umidade, horario, fk_sensor, fk_idLote, fk_transporte) values (4.4, 94.3, '14:14:01', 1, 1, 1);
insert into registros (temperatura, umidade, horario, fk_sensor, fk_idLote, fk_transporte) values (4.4, 94.3, '14:14:02', 1, 1, 1);
insert into registros (temperatura, umidade, horario, fk_sensor, fk_idLote, fk_transporte) values (4.7, 95.5, '14:14:03', 1, 1, 1);
insert into registros (temperatura, umidade, horario, fk_sensor, fk_idLote, fk_transporte) values (4.0, 95.0, '14:14:04', 1, 1, 1);
insert into registros (temperatura, umidade, horario, fk_sensor, fk_idLote, fk_transporte) values (4.2, 94.9, '14:14:05', 1, 1, 1);

-- insert into registros (temperatura, umidade, horario, idSensor, idPedido, idUsuario,) values (, , '', , , );

select * from registros;
select * from lote;