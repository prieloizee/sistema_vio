const connect = require("../db/connect");

module.exports = class ingressoController {
  //criação de evento
  static async createIngresso(req, res) {
    const { preco,tipo, fk_id_evento } = req.body;


    //Validação genérica de todos os atributos
    if (!preco|| !tipo || !fk_id_evento) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos!" });
    }

    const query = `insert into ingresso(preco, tipo,fk_id_evento) values(?,?,?)`;
    const values = [preco,tipo, fk_id_evento];

    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao comprar ingresso!" });
        }
        return res.status(201).json({ message: "ingresso criado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno no servidor!" });
    }
  } //fim do create

  //Viualizar todos os ingressos
  static async getAllingressos(req, res) {
    const query = `SELECT * FROM ingresso`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar ingresso" });
        }
        return res
          .status(200)
          .json({ message: "Ingressos listados com sucesso!", ingresso: results });
      });
    } catch (error) {
      console.log("Erro ao executar a query:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
     //Update de um ingresso
     static async updateIngresso(req, res) {
     const {id_ingresso, preco,tipo, fk_id_evento } =req.body;

    //Validação genérica de todos os atributos
    if (!id_ingresso||!preco ||!tipo||!fk_id_evento) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos!" });
    }

    const query = `UPDATE ingresso SET preco=?,tipo=?, fk_id_evento=? WHERE id_ingresso=?`;
    const values = [preco,tipo,fk_id_evento,id_ingresso];

    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados:", results);
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao atualizar o ingresso!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Ingresso não encontrado!" });
        }
        return res
          .status(200)
          .json({ message: "Ingresso atualizado com sucesso" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno no servidor!" });
    }

    }//Fechamento do update
     static async deleteIngresso(req, res) {
        const idIngresso = req.params.id;
        const query = `DELETE FROM ingresso WHERE id_ingresso=?`;
        try {
          connect.query(query, idIngresso, (err, results)=> {
            if (err) {
              console.error(err);
              return res.status(500).json({error: "Erro ao excluir ingresso!" });
            }
            if (results.affectedRows === 0) {
              return res.status(404).json({ error: "Ingresso não encontrado" });
            }
    
            return res.status(200).json({message: "Ingresso excluido com sucesso"});
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
}