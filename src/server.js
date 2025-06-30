const express = require('express');
const path = require('path');
const { PrismaClient } = require('./generated/prisma');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Servir a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Listar todos os produtos
app.get('/produtos', async (req, res) => {
  const produtos = await prisma.produto.findMany();
  res.json(produtos);
});

// Criar um novo produto
app.post('/produtos', async (req, res) => {
  const { nome, preco, quantidade } = req.body;
  const produto = await prisma.produto.create({
    data: { nome, preco, quantidade }
  });
  res.json(produto);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
