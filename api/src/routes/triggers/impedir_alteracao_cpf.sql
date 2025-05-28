delimiter //
create trigger impedir_alteracao_cpf
before update on usuario
for each row
begin
    if old.cpf<> new.cpf then
        signal sqlstate '45000'
        set message_text = 'Não é permitido alterar o CPF de um usuário já cadastrado';
    end if;
end; //
delimiter ;

-- teste
update usuario
set name ='João da Silva'
where id_usuario = 1;


update usuario
set cpf = '16000000000'
where id_usuario= 1;


create table historico_compra (
    id_historico int auto_increment primary key,
    id_compra int not null,
    data_compra datetime not null,
    id_usuario int not null,
    data_exclusão datetime default current_timestamp
);