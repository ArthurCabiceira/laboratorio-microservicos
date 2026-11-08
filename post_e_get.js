const express = require('express');
const app = express();
const PORT = Number(process.env.PORT) || 4001;

app.use(express.json());

// Lista em memória e contador para IDs únicos
let produtos = [];
let proximoId = 1;

// 1. Rota GET /produtos - Listar todos os registos
app.get('/produtos', (req, res) => {
  return res.json(produtos);
});

// 2. Rota POST /produtos - Criar novo registo com validação e ID incremental
app.post('/produtos', (req, res) => {
  const { nome, preco } = req.body;

  // Validação: 'nome' deve ser texto válido e 'preco' um número positivo
  if (!nome || typeof nome !== 'string' || nome.trim() === '' || typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ 
      erro: "Dados inválidos. 'nome' deve ser texto e 'preco' deve ser um número maior que zero." 
    });
  }

  // Criação do novo produto com ID único em memória
  const novoProduto = {
    id: proximoId++,
    nome: nome.trim(),
    preco: preco
  };

  produtos.push(novoProduto);

  // Retorna HTTP 201 Created
  return res.status(201).json(novoProduto);
});

app.put('/produtos/:id', (req, res) => {
  const produtoId = Number(req.params.id);
  if (!Number.isInteger(produtoId) || produtoId < 1) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const { nome, preco } = req.body ?? {};
  if (!nome || typeof nome !== 'string' || nome.trim() === '' || typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({
      erro: "Dados inválidos. 'nome' deve ser texto e 'preco' deve ser um número maior que zero."
    });
  }

  const indice = produtos.findIndex((produto) => produto.id === produtoId);
  if (indice === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  produtos[indice] = {
    id: produtoId,
    nome: nome.trim(),
    preco
  };

  return res.json(produtos[indice]);
});

app.delete('/produtos/:id', (req, res) => {
  const produtoId = Number(req.params.id);
  if (!Number.isInteger(produtoId) || produtoId < 1) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const indice = produtos.findIndex((produto) => produto.id === produtoId);
  if (indice === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  produtos.splice(indice, 1);
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Servidor a rodar em http://localhost:${PORT}`);
});