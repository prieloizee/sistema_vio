//Chamada da funçao "createUser" para associação ao evento de envio do formulario
document.getElementById("formulario-registro").addEventListener("submit", createUser);

document.addEventListener("DOMContentLoaded",getAllUsers);


function createUser(event) {
  //Previne o comportamento padrao do formulario, ou seja, impede que ele seja enviado e recarregue a pagina
  event.preventDefault();

  //Captura os valores dos campos do formulario
  const name = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;

  //Requisição HTTP para o endpoint de cadastro de usuario
  fetch("http://10.89.240.105:5000/api/v1/user/", {
    //Realiza uma chamada http para o servidor (a rota definida)
    method: "POST",
    headers: {
      //A requisição sera em formato json
      "Content-type": "application/json",
    },
    //Transforma os dados do formulario em uma string json para serem enviados no corpo da requisição
    body: JSON.stringify({ name, cpf, password, email }),
  })
    .then((response) => {
      //Tratamento da resposta do servidor/api
      if (response.ok) {
        //Verifica se a resposta foi bem sucedida(status 2xx)
        return response.json();
      }
      //Convertendo o erro em formato json
      return response.json().then((err) => {
        //Mensagem retornada do servidor,acessada pela chave "error"
        throw new Error(err.error);
      });
    }) //Fechamento da then (response)
    .then((data) => {
      //Executa a resposta de sucesso- retorna ao usuario final

      //Exibe um alerta para o usuario final(front) com o nome do usuario que acabou de ser cadastrado
      alert(data.message);
      console.log(data.message);

      //Reseta os campos do formulario apos o  sucesso do cadastro
      document.getElementById("formulario-registro").reset();
    })
    .catch((error) => {
      //Captura qualquer erro que ocorra durante o processo de requisição/ resposta

      //Exibe alerta (front) com o erro processado
      alert("Erro no cadastro: " + error.message);

      console.error("Erro: ", error.message);
    });
}//fechamente createUser

function getAllUsers(){
  fetch("http://10.89.240.105:5000/api/v1/user/",{
    method: "GET",
    headers:{
      "Content-Type": "application/json",
    }
  })
    .then((response) => {
      if(response.ok){
        return response.json();
      }
      return response.json().then((err)=>{
        throw new Error(err.error);
      });
    })
      .then((data)=>{
        const userList = document.getElementById("user-list");
        userList.innerHTML = ""; //Limpa a lista existente

        data.users.forEach(user => {
          const listItem= document.createElement("li");
          listItem.textContent= `Nome: ${user.name},
          CPF:${user.cpf}, Email:${user.email}`
          userList.appendChild(listItem);

        });
      })
      .catch((error)=>{
        alert("Erro ao obter usuarios" + error.message);
        console.error("Erro:",error.message);
      })
}
