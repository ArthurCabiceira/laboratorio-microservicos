const express = require('express');
const app = express();
const port = 4001;

const produtos = [
    { id: 1, nome: 'Produto A', preco: 10.99 },
    { id: 2, nome: 'Produto B', preco: 19.99 },
    { id: 3, nome: 'Produto C', preco: 5.99 },
  ];
app.get('/produtos', (req, res) => {
  res.json(produtos);
});
app.get('/produtos/:id', (req,res) =>{
    const produtoId = 1;
    const produto = produtos.find(p => p.id == produtoId);
    if(produto){
        res.json(produto);
    }else{
        res.status(404).json({error: 'Produto não encontrado'});
    }
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});