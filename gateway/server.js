const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

// Endpoints dos microsserviços internos
const PRODUTOS_URL = 'http://localhost:4001';
const PEDIDOS_URL = 'http://localhost:4002';

// 1. Encaminhamento para /api/produtos
app.use('/api/produtos', async (req, res) => {
  const caminho = req.originalUrl.replace(/^\/api\/produtos(?=\/|\?|$)/, '/produtos');
  
  try {
    const resposta = await axios({
      method: req.method,
      url: `${PRODUTOS_URL}${caminho}`,
      data: req.body,
      timeout:3000
    });
    return res.status(resposta.status).json(resposta.data);
  } catch (erro) {
    if (erro.response) {
      return res.status(erro.response.status).json(erro.response.data);
    }
    else if(erro.code === 'ECONNABORTED' || erro.code === 'ECONNREFUSED' || !erro.response){
      return res.status(503).json({erro:'Serviço temporáriamente indisponível'});
    }
    return res.status(500).json({ erro: 'Serviço de Produtos indisponível' });
  }
});

// 2. Encaminhamento para /api/pedidos
app.use('/api/pedidos', async (req,res)=>
{
    const caminho = req.originalUrl.replace(/^\/api\/pedidos(?=\/|\?|$)/, '/pedidos')
    try{
        const resposta = await axios({
            method: req.method,
            url: `${PEDIDOS_URL}${caminho}`,
            data: req.body
        })
        return res.status(resposta.status).json(resposta.data)
    }
    catch(erro){
        if(erro.response){
            return res.status(erro.response.status).json(erro.response.data)
        }
        return res.status(500).json({erro: 'Serviço de Pedidos indisponível'})
    }
});
app.get('/produtos/demorado', (req, res) => {
  setTimeout(() => {
    res.json({ mensagem: 'Resposta após 5 segundos' });
  }, 5000);
});
app.listen(PORT, () => {
  console.log(`[API Gateway] Ativo na porta ${PORT}`);
});