const connect = require("../db/connect");

module.exports = class compraController {
  static async registrarCompraSimples(req, res) {
    const { id_usuario, id_ingresso, quantidade } = req.body;

    console.log("Body: ", id_usuario, id_ingresso, quantidade);

    if (!id_usuario || !id_ingresso || !quantidade) {
      return res
        .status(400)
        .json({ error: "Dados obrigatórios não enviados!!" });
    } //fim do if

    //Chamada da procedure diretamente com os parâmetros
    connect.query(
      "call registrar_compra(?, ?, ?);",
      [id_usuario, id_ingresso, quantidade],
      (err, result) => {
        if (err) {
          console.log("Erro ao registrar compra: ", err.message);
          return res.status(500).json({ error: err.message });
        } //fim do err

        return res.status(201).json({
          message: "Compra registrada com sucesso via procedure!!",
          dados: {
            id_usuario,
            id_ingresso,
            quantidade,
          }, // array
        }); //fim do return
      } //fim da resposta
    ); //fim da query
  } // fim da registrarCompraSimples

  static async registrarCompra(req, res) {
    const { id_usuario, ingressos } = req.body;

    console.log("Body: ", id_usuario, ingressos);

    connect.query(
        "insert into compra (data_compra, fk_id_usuario) values (now(), ?)",
        [id_usuario],
        (err, result) => {
            if(err){
                //Em caso de erro na inserção da compra, retorna 500
                console.log("Erro ao inserir compra: ", err);
                return res.status(500).json({error:"Erro ao criar a compra no sistema!!!!!"});
            }

            // recupera o id da compra e recém criada
            const id_compra = result.insertId;

            console.log("Compra criada com o id: ", id_compra);

            //inicializa o indice dos ingressos a serem processados
            //let = variavel
            let index = 0; 

            //para chegar até o ultimo elemento e quando chegar ele para
            //função recursiva para processar cada ingresso sequencialmente
            function processarIngressos(){
                //condição: todos os ingressos foram processados?
                if(index >= ingressos.length){
                    return res.status(201).json({
                        message: "Compra realizada com sucesso!!!",
                        id_compra,
                        ingressos
                    });// fim do return
                }//fim do if

                //obter o ingresso atual com base no indice
                const ingresso = ingressos[index];

                //chamada da procedure para registrar as compras
                connect.query(
                    "call registrar_compra2 (?, ?, ?);",
                    [ingresso.id_ingresso, id_compra, ingresso.quantidade], 
                    (err) => {
                        if(err){
                            return res.status(500).json({
                                error: `Erro ao registrar ingresso ${index + 1}`,
                                detalhes: err.message,
                            });//fim do return
                        }//fim do if 

                        index++;
                        processarIngressos();
                    } // fim do err
                ); //fim da query
            }//fim da function

            processarIngressos();

        }// fim da resposta
    ); //fim da query
  } //fim da registrar_Compra
}; //fim da nossa controller
