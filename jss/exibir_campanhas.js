// Função para carregar as campanhas do localStorage e exibi-las
function carregarCampanhas() {
    // Recupera as campanhas salvas no localStorage
    const campanhas = JSON.parse(localStorage.getItem('campanhas')) || [];

    // Pega a div onde as campanhas serão exibidas
    const containerCampanhas = document.querySelector('.container-campanhas');

    // Limpa o conteúdo atual (caso haja algum card anterior)
    containerCampanhas.innerHTML = '';

    // Para cada campanha salva, cria um novo card e insere no container
    campanhas.forEach(campanha => {
        // Cria o elemento da campanha
        const campanhaElement = document.createElement('div');
        campanhaElement.classList.add('campanha');
        
        // Monta o HTML para o card da campanha
        campanhaElement.innerHTML = `
            <div class="card">
                <div class="nameDesc">
                    <h1>${campanha.nome}</h1>
                    <p>${campanha.descricao}</p>
                </div>
                <div class="img">
                    <img src="${campanha.imagem}" alt="Imagem da campanha"/>
                </div>
            </div>
            <div class="card-buttons">
                <button type="submit" class="card-button see-details">Ver detalhes</button>
                <button type="submit" class="card-button see-report">Ver relatórios</button>
                <button type="submit" class="card-button campaign-edit">Editar Campanha</button>
            </div>
        `;

        // Adiciona o card ao container de campanhas
        containerCampanhas.appendChild(campanhaElement);
    });
}

// Chama a função para carregar as campanhas assim que a página for carregada
window.addEventListener('load', carregarCampanhas);
