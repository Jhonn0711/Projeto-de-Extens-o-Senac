const http = require('http');
const supabase = require('./supabaseClient');

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Tratar requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
    return res.end();
  }

  else if (req.method === 'GET' && req.url === '/api/desafios') {
    const { data, error } = await supabase
      .from('desafio')
      .select(`
        id,
        titulo,
        descricao,
        id_categoria,
        categoria_desafio (
          nome
        )
      `)
      .eq('ativo', true);
  
    if (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Erro ao buscar desafios' }));
    }
  
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(data));
  }

  // GET - Buscar desafio por ID
  else if (req.method === 'GET' && req.url.startsWith('/api/desafios/')) {
    const id = parseInt(req.url.split('/').pop());

    const { data, error } = await supabase
      .from('desafio')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      res.writeHead(404);
      return res.end(JSON.stringify({ erro: 'Desafio não encontrado' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(data));
  }

  // POST - Criar novo desafio
  else if (req.method === 'POST' && req.url === '/api/desafios') {
    let body = '';
    req.on('data', chunk => body += chunk);

    req.on('end', async () => {
      try {
        const { titulo, descricao, id_categoria } = JSON.parse(body);
        const { data, error } = await supabase
          .from('desafio')
          .insert([{ titulo, descricao, id_categoria, ativo: true }]);

        if (error) throw error;

        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ sucesso: true, data }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ erro: 'Erro ao cadastrar desafio' }));
      }
    });
  }

  // PUT - Editar desafio
  else if (req.method === 'PUT' && req.url.startsWith('/api/desafios/')) {
    let body = '';
    req.on('data', chunk => body += chunk);

    req.on('end', async () => {
      const id = parseInt(req.url.split('/').pop());
      const { titulo, descricao, id_categoria } = JSON.parse(body);

      const { data, error } = await supabase
        .from('desafio')
        .update({ titulo, descricao, id_categoria })
        .eq('id', id);

      if (error) {
        res.writeHead(500);
        return res.end(JSON.stringify({ erro: 'Erro ao atualizar desafio' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ sucesso: true, data }));
    });
  }

  // DELETE - Marcar desafio como inativo
  else if (req.method === 'DELETE' && req.url.startsWith('/api/desafios/')) {
    const id = parseInt(req.url.split('/').pop());

    const { data, error } = await supabase
      .from('desafio')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      res.writeHead(500);
      return res.end(JSON.stringify({ erro: 'Erro ao excluir desafio' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ sucesso: true }));
  }


  // Endpoint para buscar desafios
  else if (req.method === 'GET' && req.url === '/api/desafios') {
    const { data, error } = await supabase
      .from('desafio')
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
  
  else if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
  
    req.on('end', async () => {
      try {
        const { email, senha } = JSON.parse(body);
        const { data, error } = await supabase
          .from('usuario')
          .select('*')
          .eq('email', email)
          .eq('senha', senha)
          .eq('ativo', true)
          .single();
  
        if (error || !data) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ erro: 'Email ou senha inválidos' }));
        }
  
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ usuario: data }));
      } catch (err) {
        console.error('Erro no login:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ erro: 'Erro no servidor ao autenticar' }));
      }
    });
  }
  else if (req.method === 'POST' && req.url === '/api/desafios') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
  
    req.on('end', async () => {
      try {
        const { titulo, descricao, id_categoria } = JSON.parse(body);
  
        const { data, error } = await supabase
          .from('desafio')
          .insert([{
            titulo,
            descricao,
            id_categoria,
            ativo: true
          }]);
  
        if (error) {
          console.error('Erro Supabase:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ erro: error.message }));
        }
  
        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ sucesso: true, data }));
      } catch (err) {
        console.error('Erro inesperado:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ erro: 'Erro ao processar dados' }));
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
