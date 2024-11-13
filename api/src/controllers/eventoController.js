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
    const { id_ingresso, preco, tipo, fk_id_evento } = req.body;

    // Validar se todos os campos foram preenchidos*

    if (!id_ingresso || !preco || !tipo || !fk_id_evento) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `update ingresso set preco=?, tipo=?, fk_id_evento=? where id_ingresso=?`;
    const values = [preco, tipo, fk_id_evento, id_ingresso];

    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ", results);

        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Erro ao atualizar o Ingresso!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Ingresso não encontrado" });
        }
        return res
          .status(201)
          .json({ message: "Ingresso atualizado com sucesso!" });
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
      connect.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao excluir evento!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado" });
        }

        return res.status(200).json({ message: "Evento excluido com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
  static async getEventosPorData(req, res) {
    const query = `SELECT * FROM  evento`;
    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
        const dataEvento = new Date(results[0].data_hora);
        const dia = dataEvento.getDate();
        const mes = dataEvento.getMonth() + 1;
        const ano = dataEvento.getFullYear();
        console.log(dia + "/" + mes + "/" + ano);

        const dataEvento1 = new Date(results[1].data_hora);
        const dia1 = dataEvento1.getDate();
        const mes1 = dataEvento1.getMonth() + 1;
        const ano1 = dataEvento1.getFullYear();
        console.log(dia1 + "/" + mes1 + "/" + ano1);

        const dataEvento2 = new Date(results[2].data_hora);
        const dia2 = dataEvento2.getDate();
        const mes2 = dataEvento2.getMonth() + 1;
        const ano2 = dataEvento2.getFullYear();
        console.log(dia2 + "/" + mes2 + "/" + ano2);

        //Identifica se a data já passou
        const now = new Date();
        const eventosPasssados = results.filter(
          (evento) => new Date(evento.data_hora) < now
        );
        const eventosFuturos = results.filter(
          (evento) => new Date(evento.data_hora) >= now
        );

        //Definido quando tempo em horas minutos e segundos faltam para o evento
        const diferencaMs =
          eventosFuturos[0].data_hora.getTime() - now.getTime();
        const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
        const horas = Math.floor(
          (diferencaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        console.log(diferencaMs, "Falta:" + dias + "dias e " + horas + "horas");

        //Comparando datas
        const dataFiltro = new Date("2024-12-15").toISOString().split("T");
        const eventosDia = results.filter((evento) =>new Date(evento.data_hora).toISOString().split("T")[0] ===dataFiltro[0]);
        console.log("Eventos: ", eventosDia);

        return res.status(200).json({ message: "OK", eventosFuturos, eventosPasssados });
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  }

  //Mostra os eventos que acontecem em tal dia e nos proximos 7
  static async getEventosdia(req,res){
    const dataRecebida = req.params.data;

    // Converte a data recebida em um objeto Date
    const dataInicial = new Date(dataRecebida);
    const dataFinal = new Date(dataInicial);
    dataFinal.setDate(dataInicial.getDate() + 7); // Adiciona 7 dias à data inicial

    const dataInicial2 = new Date("2024-01-01").toISOString().split('T')[0];
    const dataFinal2 = new Date("2024-01-07").toISOString().split('T')[0];

    const query = `
      SELECT * FROM evento WHERE data_hora >= ? AND data_hora <= ?`;
    try {
     
      connect.query(query,[dataInicialStr, dataFinalStr], (err, results) => {
        if (err) {console.error(err);return res.status(500).json({ error: "Erro ao buscar eventos" });
        }

        return res.status(200).json({ message: "OK", dataInicial2, dataFinal2 });
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  }
};
