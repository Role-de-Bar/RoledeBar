const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Consumidor = require("../models/entities/Consumidor");
const Proprietario = require("../models/entities/Proprietario");

const SECRET = "chave-super-secreta";

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    let user = null;
    let tipo = null;

    user = await Proprietario.findOne({ where: { email } });
    if (user) tipo = "proprietario";

    if (!user) {
      user = await Consumidor.findOne({ where: { email } });
      if (user) tipo = "consumidor";
    }

    if (!user) {
      return res.status(400).json({ erro: "Email ou senha inválidos" });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ erro: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        tipoUsuario: tipo,
        email: user.email,
      },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      mensagem: "Login bem-sucedido!",
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipoUsuario: tipo,
      },
      token,
    });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

module.exports = router;