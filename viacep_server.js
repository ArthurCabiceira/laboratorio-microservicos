const express = require('express')
const app = express()
const axios= require('axios')
const PORT = 4001
app.get('/enderecos/:cep',async (req,res)=>{
    const { cep } = req.params
    if (!/^\d{8}$/.test(cep)) {
        return res.status(400).json({erro:'CEP inválido'})
    }

    try{
        const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        if (resposta.data.erro) {
            return res.status(404).json({erro:'Endereço não encontrado'})
        }
        return res.json(resposta.data)
    }
    catch(erro){
        if(erro.response && erro.response.status===404){
            return res.status(404).json({erro:'Endereço não encontrado'})
        }
        if(erro.response && erro.response.status===400){
            return res.status(404).json({erro:'Pedido mal formulado'})
        }
        return res.status(502).json({erro:'Falha ao consultar o serviço ViaCEP'})
    }
})
app.listen(PORT, ()=>
{
    console.log('Servidor funcionando em http://localhost:4001')
})

