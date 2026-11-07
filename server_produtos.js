const express = require('express');
const app = express();
const port = 4001;

app.use(express.json());

const produtos = [
  { id: 1, nome: "Teclado Mecânico", categoria: "perifericos", preco: 150 },
  { id: 2, nome: "Rato Wireless", categoria: "perifericos", preco: 80 },
  { id: 3, nome: "Monitor 24", categoria: "monitores", preco: 600 },
  { id: 4, nome: "Cadeira Gaming", categoria: "escritorio", preco: 250 }
];
app.get('/produtos', (req, res) => {
  const {categoria,limite} = req.query;
  let resultado = [...produtos]
  if(categoria){
    resultado = resultado.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
  }
  if(limite){
    const limiteInt = parseInt(limite);
    if(isNaN(limiteInt) || limiteInt < 1){
      return res.status(400).json({error: 'Limite inválido'});
    }
    resultado = resultado.slice(0, limiteInt);
  }
  res.json(resultado);
});

app.get('/produtos/:id', (req,res) =>{
    const produtoId = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === produtoId);
    if(produto){
        res.json(produto);
    }else{
        res.status(404).json({error: 'Produto não encontrado'});
    }
})

app.post('/produtos', (req, res) => {
  const { nome, categoria, preco } = req.body;
  if(nome === undefined || categoria === undefined || preco === undefined){
    return res.status(400).json({error: 'Campos obrigatórios não fornecidos'});
  }
  const novoProduto = { id: produtos.length + 1, nome, categoria, preco };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});