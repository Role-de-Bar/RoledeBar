const express = require("express");
const router = express.Router();
const Favorito = require("../models/entities/Favorito");

//////////////////////////////////////////////// CREATE ////////////////////////////////////////////////

router.post("/add", async (req, res) => {
  try {
    const { estabelecimento_id, consumidor_id, proprietario_id } = req.body;

    if (!consumidor_id && !proprietario_id) {
      return res
        .status(400)
        .json({ message: "Consumidor ou proprietário deve estar presente" });
    }

    const [favorito, created] = await Favorito.findOrCreate({
      where: {
        estabelecimento_id,
        consumidor_id: consumidor_id || null,
        proprietario_id: proprietario_id || null,
      },
    });

    res.status(created ? 201 : 200).json({
      message: created ? "Favorito adicionado" : "Favorito já existe",
      favorito,
    });
  } catch (erro) {
    res
      .status(500)
      .json({ message: "Erro ao adicionar favorito", error: erro.message });
  }
});

//////////////////////////////////////////////// READ ////////////////////////////////////////////////

router.get("/user/:tipo/:id", async (req, res) => {
  try {
    const { tipo, id } = req.params;
    let where = {};
    if (tipo === "consumidor") where.consumidor_id = id;
    else if (tipo === "proprietario") where.proprietario_id = id;
    else return res.status(400).json({ message: "Tipo inválido" });

    const favoritos = await Favorito.findAll({ where });
    res.json(favoritos);
  } catch (erro) {
    res
      .status(500)
      .json({ message: "Erro ao listar favoritos", error: erro.message });
  }
});

//////////////////////////////////////////////// DELETE ////////////////////////////////////////////////

router.delete("/remove", async (req, res) => {
  try {
    const { estabelecimento_id, consumidor_id, proprietario_id } = req.body;

    const deleted = await Favorito.destroy({
      where: {
        estabelecimento_id,
        consumidor_id: consumidor_id || null,
        proprietario_id: proprietario_id || null,
      },
    });

    res.json({
      message: deleted ? "Favorito removido" : "Favorito não encontrado",
    });
  } catch (erro) {
    res
      .status(500)
      .json({ message: "Erro ao remover favorito", error: erro.message });
  }
});

module.exports = router;
