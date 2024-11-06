const connect = require("../db/connect");

module.exports = class eventoController {
  //criação de evento
  static async createEvento(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador } = req.body;

    //Validação genérica de todos os atributos
    if (!nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos!" });
    }

    const query = `insert into evento(nome, descricao, data_hora,local, fk_id_organizador) values(?,?,?,?,?)`;
    const values = [nome, descricao, data_hora, local, fk_id_organizador];

    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o evento!" });
        }
        return res.status(201).json({ message: "Evento criado com sucesso" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno no servidor!" });
    }
  } //fim do create

  //Viualizar todos os eventos
  static async getAllEventos(req, res) {
    const query = `SELECT * FROM evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
        return res
          .status(200)
          .json({ message: "Eventos listados com sucesso!", events: results });
      });
    } catch (error) {
      console.log("Erro ao executar a query:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async updateEvento(req, res) {

    // Desestrutura e recupera os dados enviados via corpo da requisição*
    const { id_ingresso, preco, tipo, fk_id_evento } =req.body;
    
    // Validar se todos os campos foram preenchidos*
    
    if (!id_ingresso || !preco || !tipo || !fk_id_evento ) { 
    return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    }
    
    const query = `update ingresso set preco=?, tipo=?, fk_id_evento=? where id_ingresso=?`;
    const values = [preco, tipo, fk_id_evento, id_ingresso];
    
    try {
    
    connect.query(query, values, (err,results) => {
    console.log("Resultados: ", results);
    
    if (err) {
    console.log(err);
    return res.status(500).json({ error: "Erro ao atualizar o Ingresso!" });
    }if (results.affectedRows === 0) {
    return res.status(404).json({ error: "Ingresso não encontrado" });
    }
    return res.status(201).json({ message: "Ingresso atualizado com sucesso!" });

    });
    } catch (error) {
    console.log("Erro ao executar consulta:", error);
    res.status(500).json({ error: "Erro interno so servidor!" });
    }
    }
  static async deleteEvento(req, res) {
    const idEvento = req.params.id;
    const query = `DELETE FROM evento WHERE id_evento=?`;
    const values = [idEvento];
    try {
      connect.query(query, values, (err, results)=> {
        if (err) {
          console.error(err);
          return res.status(500).json({error: "Erro ao excluir evento!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado" });
        }

        return res.status(200).json({message: "Evento excluido com sucesso"});
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
};
