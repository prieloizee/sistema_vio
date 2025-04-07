delimiter $$
create function calcula_idade(datanascimento date)
returns int
deterministic
contains sql
--no sql
begin
declare idade int;
set idade = timestampdiff(year, datanascimento, curdate());
return idade;
end; $$
delimiter ;

-- Verifica se a fução especificada foi criada
show create function calcula_idade;

SELECT name, calcula_idade(data_nascimento) AS idade FROM usuario;

delimiter $$
create function status_sistema()
returns varchar(50)
no sql
begin
return 'Sistema operando normalmente';
end; $$
delimiter ;

--execução da query
select status_sistema();

delimiter $$
create function total_compras_usuario(id_usuario int)
returns int
reads sql data
begin
    declare total int;

    select count(*) into total
    from compra
    where id_usuario = compra.fk_id_usuario;

    return total;
    end; $$
    delimiter ;

select total_compras_usuario(3) as 'Total de Compras';

create table log_evento(id_log int auto_increment primary key,
mensagem varchar(255),
data_log datetime default current_timestamp
);

create function registrar_log_evento(texto varchar(255))
returns varxchar(50)
modifies sql data
begin
insert into log_evento(mensagem)
values(texto);

return 'Log inserido com sucesso';

