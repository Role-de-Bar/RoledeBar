const express = require("express");
const app = express();
const port = 8081;
const Consumidor = require("./models/entities/Consumidor");
const Proprietario = require("./models/entities/Proprietario");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// configuração body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: "http://localhost:3000" }));

const SECRET = "chave-super-secreta";

app.listen(port, function (req, res) {
  console.log(`Servidor rodando na porta ${port}.`);
});

app.post("/login", async (req, res) => {
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

app.post("/cadastroConsumidor", (req, res) => {
  const { nome, email, senha, telefone, data_nascimento, cep } = req.body;
  Consumidor.create({
    nome: nome,
    email: email,
    senha: senha,
    telefone: telefone,
    data_nascimento: data_nascimento,
    cep: cep,
  })
    .then(() => {
      res.send("Usuário cadastrado com sucesso!");
    })
    .catch((erro) => {
      res.send("Erro ao cadastrar usuário: " + erro);
    });
});

app.post("/cadastroProprietario", (req, res) => {
  const { nome, cpf, email, senha, telefone, data_nascimento, cep } = req.body;
  Proprietario.create({
    nome: nome,
    cpf: cpf,
    email: email,
    senha: senha,
    telefone: telefone,
    data_nascimento: data_nascimento,
    cep: cep,
  })
    .then(() => {
      res.send("Usuário cadastrado com sucesso!");
    })
    .catch((erro) => {
      res.send("Erro ao cadastrar usuário: " + erro);
    });
});

// app.get("/Consumidors", (req, res) => {
//   Consumidor.findAll()
//     .then((Consumidors) => {
//       res.send(Consumidors);
//     })
//     .catch((erro) => {
//       res.send("Erro ao buscar os dados: " + erro);
//     });
// });

// app.get("/Consumidors/:id", (req, res) => {
//   Consumidor.findAll({ where: { id: req.params.id } })
//     .then((Consumidor) => {
//       res.send(Consumidor);
//     })
//     .catch((erro) => {
//       res.send("Erro ao buscar os dados: " + erro);
//     });
// });

// app.patch("/Consumidors/:id", (req, res) => {
//   const { nome, email, senha } = req.body;
//   Consumidor.update(
//     {
//       nome: nome,
//       email: email,
//       senha: senha,
//     },
//     { where: { id: req.params.id } }
//   )
//     .then(() => {
//       res.send("Usuário atualizado com sucesso!");
//     })
//     .catch((erro) => {
//       res.send("Erro ao atualizar usuário: " + erro);
//     });
// });

// app.delete("/Consumidors/:id", (req, res) => {
//   Consumidor.destroy({ where: { id: req.params.id } })
//     .then(() => {
//       res.send("Usuário excluído com sucesso.");
//     })
//     .catch((erro) => {
//       res.send("Erro ao excluir conta: " + erro);
//     });
// });
