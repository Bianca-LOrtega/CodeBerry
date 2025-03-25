create database codeberry;

use codeberry;

create table transportadora (
	idTransportadora int PRIMARY KEY auto_increment,
    nomeEmpresa Varchar(40),
    cnpj char (12),
    senha varchar(20)
);

create table pedido (
	idPedido int PRIMARY KEY auto_increment,
    veiculo varchar(40),
    partida varchar(50),
    destino varchar(50),
    dataPedido datetime,
    idTransportadora int,
    foreign key (idTransportadora) references transportadora(idTransportadora)
);

create table sensor (
	idSensor int PRIMARY KEY auto_increment,
    nomeSensor varchar(20)
);

create table registros (
	idRegistro int PRIMARY KEY auto_increment,
    temperatura decimal(3, 1),
    umidade decimal(3, 1),
    horario time,
    idPedido int,
    idTransportadora int,
    idSensor int,
    foreign key (idSensor) references sensor(idSensor),
    foreign key (idPedido) references pedido(idPedido),
	foreign key  (idTransportadora) references transportadora(idTransportadora)
);

insert into transportadora (nomeEmpresa, cnpj, senha) values ('empresa1', '353498561847', '123456');
insert into transportadora (nomeEmpresa, cnpj, senha) values ('empresa2', '353498549237', '098765');
insert into pedido (veiculo, partida, destino, dataPedido, idTransportadora) values ('caminhao1', 'Minas gerais', 'Sao Paulo', '2025-04-19 18:30:00', 1);
insert into sensor (nomeSensor) value ('sensor 1');

insert into registros (temperatura, umidade, horario, idSensor, idPedido, idTransportadora) values (4.5, 94.2, '14:13:58', 1, 1, 1);
insert into registros (temperatura, umidade, horario, idSensor, idPedido, idTransportadora) values (4.6, 94.7, '14:13:59', 1, 1, 1);
insert into registros (temperatura, umidade, horario, idSensor, idPedido, idTransportadora) values (4.2, 94.6, '14:14:00', 1, 1, 1);
insert into registros (temperatura, umidade, horario, idSensor, idPedido, idTransportadora) values (4.4, 94.3, '14:14:01', 1, 1, 1);
insert into registros (temperatura, umidade, horario, idSensor, idPedido, idTransportadora) values (4.4, 94.3, '14:14:02', 1, 1, 1);
insert into registros (temperatura, umidade, horario, idSensor, idPedido, idTransportadora) values (4.7, 95.5, '14:14:03', 1, 1, 1);
insert into registros (temperatura, umidade, horario, idSensor, idPedido, idTransportadora) values (4.0, 95.0, '14:14:04', 1, 1, 1);
insert into registros (temperatura, umidade, horario, idSensor, idPedido, idTransportadora) values (4.2, 94.9, '14:14:05', 1, 1, 1);

-- insert into registros (temperatura, umidade, horario, idSensor, idPedido, idUsuario,) values (, , '', , , );

select * from registros;
select * from pedido;