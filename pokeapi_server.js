const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 4001;

app.use(express.json());

// Rota GET /pokemon/:id
app.get('/pokemon/:id', async (req, res) => {
  const { id } = req.params;

  // Aceita tanto o ID numérico como o nome do Pokémon (ex: 25 ou 'pikachu')
  // Se for enviado número, valida para garantir que é positivo
  const idNum = Number(id);
  if (!isNaN(idNum) && idNum <= 0) {
    return res.status(400).json({ 
      erro: "O ID do Pokémon deve ser um número inteiro positivo." 
    });
  }

  try {
    // 1. Consulta à PokéAPI externa
    const resposta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id.toLowerCase()}`);
    const pokemonData = resposta.data;

    // 2. Extrai e formata apenas os dados solicitados (nome, tipos e habilidades)
    const tipos = pokemonData.types.map(item => item.type.name);
    const habilidades = pokemonData.abilities.map(item => item.ability.name);

    // 3. Retorna o JSON reduzido
    return res.json({
      id: pokemonData.id,
      nome: pokemonData.name,
      tipos: tipos,
      habilidades: habilidades
    });
  } catch (erro) {
    // 4. Trata erro 404 caso o Pokémon não exista na PokéAPI
    if (erro.response && erro.response.status === 404) {
      return res.status(404).json({ 
        erro: "Pokémon não encontrado na base de dados externa." 
      });
    }

    return res.status(500).json({ 
      erro: "Erro ao consultar a PokéAPI." 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a rodar em http://localhost:${PORT}`);
});