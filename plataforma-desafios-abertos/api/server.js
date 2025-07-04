const http = require('http');
const supabase = require('./supabaseClient');

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
    try {
      
      let { data, error } = await supabase.rpc('listar_usuarios_com_tipo')
      if (error) console.error(error)
      else console.log(data)

  
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data));
  
    } catch (err) {
      console.error('Erro inesperado:', err); // <-- Aqui loga erros JS inesperados
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Erro inesperado no servidor', detalhes: err.message }));
    }
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
