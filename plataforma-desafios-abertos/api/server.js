const http = require('http');
const supabase = require('./supabaseClient'); // importa o cliente

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // Endpoint para buscar desafios
  if (req.method === 'GET' && req.url === '/api/desafios') {
    const { data, error } = await supabase
      .from('desafios')
      .select('*');

    if (error) {
      res.writeHead(500);
      return res.end(JSON.stringify({ erro: 'Erro ao buscar dados' }));
    }

    res.writeHead(200);
    return res.end(JSON.stringify(data));
  }

  else if (req.method === 'GET' && req.url === '/api/usuarios') {
    const { data, error } = await supabase.rpc('sql', {
      query: "SELECT id, nome FROM usuarios WHERE id IN (1, 2, 3)"
    });

    if (error) {
      res.writeHead(500);
      return res.end(JSON.stringify({ erro: 'Erro ao buscar usuários' }));
    }

    res.writeHead(200);
    return res.end(JSON.stringify(data));
  }

  // Outros endpoints
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ erro: 'Endpoint não encontrado' }));
  }
});

server.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
