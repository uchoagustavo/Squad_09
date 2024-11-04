document.addEventListener('DOMContentLoaded', () => {
    const campaignsContainer = document.querySelector('.container-campanhas');
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || []; // Recupera as campanhas do localStorage

    campaigns.forEach(campaign => {
        // Cria a estrutura HTML para cada campanha
        const campaignElement = document.createElement('div');
        campaignElement.classList.add('campanha');

        campaignElement.innerHTML = `
            <div class="card">
                <div class="nameDesc">
                    <h1>${campaign.nomeCampanha}</h1>
                    <p>${campaign.descCampanha}</p>
                </div>
                <div class="img">
                    <img src="${campaign.imageBase64 || 'imgs/placeholder.jpg'}" alt="Imagem da campanha" style="max-width: 100px;">
                </div>
            </div>
            <div class="card-buttons">
                <button type="button" class="card-button see-details" onclick="viewDetails(${campaign.id})">Ver detalhes</button>
                <button type="button" class="card-button see-report">Ver relatórios</button>
                <button type="button" class="card-button campaign-edit">Editar Campanha</button>
            </div>
        `;

        // Adiciona a campanha ao container principal
        campaignsContainer.appendChild(campaignElement);
    });
});

// Função para abrir detalhes da campanha (usando o ID para identificar no localStorage)
function viewDetails(campaignId) {
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const campaign = campaigns.find(c => c.id === campaignId);

    if (campaign) {
        // Exemplo: exibe detalhes no console ou redireciona para uma página de detalhes
        console.log(campaign);
    }
}
