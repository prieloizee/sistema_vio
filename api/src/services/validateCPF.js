const connect = require("../db/connect");

module.exports = async function validateCPF(cpf,userId){
    const query = "SELECT id_usuario FROM usuario where cpf=?";
    const values=[cpf];

    connect.query(query,values,(err,results)=>{
        if(err){

        }
        else if(results.lenght>0){
            const idDocpfCadastrado = results[0].id_usuario;

            if(userId && idDocpfCadastrado !==userId){
                return{error:"CPF já cadastrado por outro usuário"}
            }else if (!userId){
                return{error:"CPF já cadastrado!"}
            }
        }
        else{
            return null;
        }
    })
}