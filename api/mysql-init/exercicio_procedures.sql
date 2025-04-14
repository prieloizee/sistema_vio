-- Atividade total ingressos 14/04
delimiter $$

create function total_ingressos_vendidos(id_evento INT) 
returns int
not deterministic
begin
    declare total_vendido int;

    select SUM(ic.quantidade)
    into total_vendido
    from ingresso_compra ic
    join ingresso i on ic.fk_id_ingresso = i.id_ingresso
    where i.fk_id_evento = id_evento;

    return ifnull(total_vendido, 0);  
end; $$

delimiter ;

delimiter $$
create function renda_total_evento(id_evento INT) 
returns decimal(10,2)
not deterministic
begin
    declare total_renda decimal(10,2);

    select sum(i.preco * ic.quantidade)
    into total_renda
    from ingresso_compra ic
    join ingresso i on ic.fk_id_ingresso = i.id_ingresso
    where i.fk_id_evento = id_evento;

    return ifnull(total_renda, 0); 
end; $$
delimiter ;

--PROCEDURES
delimiter $$

create procedure resumo_evento(in pid_evento int)
begin
    declare nome_evento varchar(100);
    declare data_evento date;
    declare total_ingressos int;
    declare renda_total decimal(10,2);

   
    select e.nome, e.data_hora into nome_evento, data_evento
    from evento e
    where e.id_evento = pid_evento;

    
    select ifnull(SUM(ic.quantidade), 0) into total_ingressos
    from ingresso_compra ic
    join ingresso i ON i.id_ingresso = ic.fk_id_ingresso
    where i.fk_id_evento = pid_evento;

    
    select ifnull(SUM(i.preco * ic.quantidade), 0) into renda_total
    from ingresso_compra ic
    join ingresso i on i.id_ingresso = ic.fk_id_ingresso
    where i.fk_id_evento = pid_evento;

    
    select nome_evento as nome_evento,
           data_evento as data_evento,
           total_ingressos as total_ingressos_vendidos,
           renda_total as renda_total;
end $$

delimiter ;