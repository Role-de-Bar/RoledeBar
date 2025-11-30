const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const Estabelecimento = require("../models/entities/Estabelecimento");

//////////////////////////////////////////////// CREATE ////////////////////////////////////////////////

router.post("/cadastro", upload.single("foto"), async (req, res) => {
  try {
    const {
      nome,
      cnpj,
      telefone,
      email,
      tipoEstabelecimento,
      tipoMusica,
      estiloMusical,
      comodidades,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      descricao,
      proprietario_id,
    } = req.body;

    const parsedComodidades =
      typeof comodidades === "string"
        ? JSON.parse(comodidades)
        : comodidades;

    const novo = await Estabelecimento.create({
      nome,
      cnpj,
      telefone,
      email,
      tipoEstabelecimento,
      tipoMusica,
      estiloMusical,
      comodidades: parsedComodidades,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      descricao,
      foto: req.file ? req.file.filename : null,
      proprietario_id,
    });

    return res.status(201).json({
      message: "Estabelecimento cadastrado com sucesso!",
      estabelecimento: novo,
    });

  } catch (erro) {
    console.error("Erro ao cadastrar estabelecimento:", erro);
    return res.status(500).json({ error: erro.message });
  }
});


//////////////////////////////////////////////// READ ////////////////////////////////////////////////

router.get("/all", (req, res) => {
  Estabelecimento.findAll()
    .then((estabelecimentos) => {
      res.send(estabelecimentos);
    })
    .catch((erro) => {
      res.send("Erro ao buscar os dados: " + erro);
    });
});


router.get("/:id", (req, res) => {
  Estabelecimento.findAll({ where: { proprietario_id: req.params.id } })
    .then((estabelecimentos) => {
      res.send(estabelecimentos);
    })
    .catch((erro) => {
      res.send("Erro ao buscar os dados: " + erro);
    });
});

//////////////////////////////////////////////// UPDATE ////////////////////////////////////////////////

router.patch("/:id", (req, res) => {
  Estabelecimento.update(req.body, {
    where: { id: req.params.id },
  })
    .then(() => {
      res.send("Estabelecimento atualizado com sucesso!");
    })
    .catch((erro) => {
      res.send("Erro ao atualizar estabelecimento: " + erro);
    });
});

//////////////////////////////////////////////// DELETE ////////////////////////////////////////////////

router.delete("/:id", (req, res) => {
  Estabelecimento.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.send("Estabelecimento excluído com sucesso.");
    })
    .catch((erro) => {
      res.send("Erro ao excluir estabelecimento: " + erro);
    });
});

module.exports = router;
