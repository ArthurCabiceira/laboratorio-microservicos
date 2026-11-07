const axios= require('axios')
const express = require('express')
const app = express()
const PORT = 4001
app.use(express.json())
app.get('/usuarios/:id', async (req,res)=>{
const id = req.params.id;
const idnum = Number(id);
if(!Number.isInteger(idnum) || idnum<=0){
  return res.status(400).json({erro:'Erro, o ID é inválido'});
}
try{
  const resposta = await axios.get(`https://jsonplaceholder.typicode.com/users/${idnum}`);
  return res.json(resposta.data);
}
catch(erro){
  if(erro.response && erro.response.status===404){
    return res.status(404).json({erro:'O objeto não foi encontrado'});
  }
  return res.status(502).json({erro:'Falha ao consultar o serviço de usuários'});
}
});

app.get('/tarefas', async (req, res) => {
  const { usuario } = req.query;

  try {
    // 1. Consulta a lista completa de tarefas na JSONPlaceholder
    const resposta = await axios.get('https://jsonplaceholder.typicode.com/todos');
    let tarefas = resposta.data;

    // 2. Se o parâmetro ?usuario= for fornecido, filtra por userId
    if (usuario) {
      const userIdNum = Number(usuario);

      if (isNaN(userIdNum) || userIdNum <= 0) {
        return res.status(400).json({ 
          erro: "O parâmetro 'usuario' deve ser um número inteiro positivo." 
        });
      }

      tarefas = tarefas.filter(tarefa => tarefa.userId === userIdNum);
    }

    return res.json(tarefas);
  } catch (erro) {
    return res.status(500).json({ 
      erro: "Erro ao consultar as tarefas na API externa." 
    });
  }
});

app.listen(PORT,()=>{
  console.log('Servidor funcionando em http://localhost:4001')
});
