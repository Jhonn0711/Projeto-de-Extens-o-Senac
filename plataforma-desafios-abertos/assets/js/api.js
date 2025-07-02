function carregarDesafios() {
    fetch('http://localhost:3000/api/desafios')
      .then(res => res.json())
      .then(data => {
        const grid = document.getElementById('challenges-grid');
        grid.innerHTML = ''; // limpa
  
        data.forEach(desafio => {
          grid.innerHTML += `
            <div class="col-md-4">
              <div class="card mb-3 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">${desafio.titulo}</h5>
                  <p class="card-text"><strong>Categoria:</strong> ${desafio.categoria}</p>
                </div>
              </div>
            </div>
          `;
        });
      })
      .catch(err => {
        console.error('Erro ao carregar desafios:', err);
      });
  }