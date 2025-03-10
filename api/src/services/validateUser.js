module.exports = function validateUser({
  cpf,
  email,
  password,
  name,
  data_nascimento,
}) {
  //Logica
  if (!cpf || !email || !password || !name || !data_nascimento) {
    return { error: "Todos os campos devem ser preenchidos" };
  }
  if (isNaN(cpf) || cpf.length !== 11) {
    return { error: "CPF invalido,deve conter 11 dígitos numéricos" };
  }
  if (!email.includes("@")) {
    return { error: "Email invalido. Deve conter @" };
  }
  return null; //Se estiver tudo certo eu retorno nulo para ignorar o if na userController
};
