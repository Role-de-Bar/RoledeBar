import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/authMidd.js";
import { z } from "zod";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


// SCHEMA DE VALIDAÇÃO

const userSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  tipo: z.enum(["PROPRIETARIO", "CONSUMIDOR"], "Tipo inválido"),
});



app.post("/auth/register", async (req, res) => {
  try {
    const data = userSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser)
      return res.status(400).json({ message: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(data.senha, 10);

    const newUser = await prisma.user.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword,
        tipo: data.tipo,
      },
    });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        tipo: newUser.tipo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});


app.post("/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login bem-sucedido",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});


app.post("/estabelecimento", authMiddleware(["PROPRIETARIO"]), async (req, res) => {
  try {
    const { nome, endereco, tipo, comodidades } = req.body;
    const userId = req.user.id; // ID do proprietário autenticado

    const estabelecimento = await prisma.estabelecimento.create({
      data: {
        nome,
        endereco,
        tipo,
        comodidades,
        proprietarioId: userId
      }
    });

    res.status(201).json(estabelecimento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get("/estabelecimentos", authMiddleware(["PROPRIETARIO", "CONSUMIDOR"]), async (req, res) => {
  try {
    const estabelecimentos = await prisma.estabelecimento.findMany();
    res.json(estabelecimentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
