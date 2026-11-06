const express = require('express');
const app = express();
const port = 4001;

app.get('/status', (req, res) => {
  res.json({nome: 'Meu micro-serviço', versao: '1.0.0', status:'Online'});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});