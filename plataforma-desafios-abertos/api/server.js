const http = require('http');
const supabase = require('./supabaseClient');

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Tratar requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
    return res.end();
  }

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

  else if (req.method === 'POST' && req.url === '/api/usuarios') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
  
    req.on('end', async () => {
      try {
        const dados = JSON.parse(body);
        console.log('📦 Dados recebidos para cadastro:', dados);
    
        const { nome, razao_social, cpf, cnpj, email, senha, descricao, id_tipo_usuario } = dados;
    
        const { data, error } = await supabase
          .from('usuario')
          .insert([{
            nome,
            razao_social,
            cpf,
            cnpj,
            email,
            senha,
            descricao,
            id_tipo_usuario,
            ativo: true
          }]);
    
        if (error) {
          console.error('❌ Erro Supabase:', JSON.stringify(error, null, 2));
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ erro: error.message || 'Erro desconhecido no Supabase' }));
        }
    
        console.log('✅ Usuário inserido com sucesso:', data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ sucesso: true, data }));
      } catch (err) {
        console.error('❌ Erro inesperado:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ erro: 'Erro ao processar dados', detalhes: err.message }));
      }
    });
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
