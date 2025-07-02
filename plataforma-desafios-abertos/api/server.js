const http = require('http');

const challenges = [
  { id: 1, titulo: 'Reduzir desperdício de água', categoria: 'sustentabilidade' },
  { id: 2, titulo: 'Otimizar logística urbana', categoria: 'tecnologia' }
];

const server = http.createServer((req, res) => {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/api/desafios') {
    res.writeHead(200);
    res.end(JSON.stringify(challenges));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ erro: 'Endpoint não encontrado' }));
  }
});

server.listen(3000, () => {
  console.log('Ta rodando essa naba');
});

