// routes/estabelecimento.js

const express = require("express");
const router = express.Router();
// Importa a configuração do Multer
const upload = require("../middlewares/upload"); 
const Estabelecimento = require("../models/entities/Estabelecimento");

// O middleware `upload.single("foto")` é usado aqui
router.post("/estabelecimento", upload.single("foto"), async (req, res) => {
  try {
    const dados = req.body;

    const estabelecimento = await Estabelecimento.create({
      ...dados,
      // req.file é fornecido pelo Multer
      foto: req.file ? req.file.filename : null, 
    });

    return res.json({
        mensagem: "Estabelecimento cadastrado com sucesso!",
        estabelecimento: estabelecimento
    });
  } catch (error) {
    console.error("Erro ao cadastrar estabelecimento:", error);
    return res.status(500).json({ erro: "Erro ao cadastrar estabelecimento", detalhes: error.message });
  }
});

module.exports = router;