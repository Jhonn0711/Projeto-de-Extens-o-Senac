async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    return null; // ou você pode lançar o erro se quiser que quebre
  }
}

async function carregarDesafios() {
  const data = await fetchData('http://localhost:3000/api/desafios');

  if (!data) return; // evita erro se der null

  const grid = document.getElementById('challenges-grid');
  grid.innerHTML = '';

  data.forEach(desafio => {
    grid.innerHTML += `
      <div class="col-md-4">
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${desafio.titulo}</h5>
            <p class="card-text"><strong>Categoria:</strong> ${desafio.categoria}</p>
          </div>
        </div>
      </div>`;
  });
}


