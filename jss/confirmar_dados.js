document.addEventListener('DOMContentLoaded', function () {
    function loadLatestCampaign() {
        const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');

        // Encontra a campanha mais recente (com maior ID)
        const latestCampaign = campaigns.reduce((prev, current) => (prev.id > current.id ? prev : current));

        // Preenchendo os campos da página
        function fillField(selector, value, isArray = false, joinChar = ', ') {
            const element = document.querySelector(selector);
            if (element) {
                if (isArray && Array.isArray(value)) {
                    element.innerHTML = `<h3>${value.join(joinChar)}</h3>`;
                } else if (value) {
                    element.innerHTML = `<h3>${value}</h3>`;
                } else {
                    element.innerHTML = `<h3>Informação não disponível</h3>`;
                }
            }
        }

        // Preencher Nome
        fillField('.nome-campanha', latestCampaign.nome);

        // Preencher Descrição
        fillField('.descricao-campanha', latestCampaign.descricao);

        // Preencher Imagem
        const imgElement = document.querySelector('.img');
        if (imgElement) {
            imgElement.innerHTML = `<img src="${latestCampaign.imagem || 'A campanha não contém imagem'}" alt="Imagem da campanha" style="max-width: 100%; height: auto;">`;
        }

        // Preencher cartões
        fillField('.cartoesCampanha', latestCampaign.cartoes, true);

        // Preencher mecânicas
        fillField('.mecanicaCampanha', latestCampaign.mecanicas, true);

        // Exemplo de como você aplicaria isso para prêmios
        fillPrizeField('.premioCampanha', latestCampaign.premios);

        // Preencher limite de cashback
        fillField('.limiteCashbackCampanha', latestCampaign.limiteCashback);

        // Preencher estabelecimento comercial
        fillField('.estabelecimentosComerciaisCampanha', latestCampaign.estabelecimento);

        // Preencher período (datas de início e término)
        fillField('.dataInicioCampanha', latestCampaign.periodo?.inicio);
        fillField('.dataTerminoCampanha', latestCampaign.periodo?.termino);

        // Preencher fator de categorização
        fillField('.categorizacaoCampanha', latestCampaign.fatorCategorizacao, true);

        // Preencher MCCs
        fillField('.MCCSCampanha', latestCampaign.mccs, true);

        // Preencher modos de entrada
        fillField('.modosEntradaCampanha', latestCampaign.modosEntrada, true);
    }

    loadLatestCampaign();
});


// Função para exibir o prêmio corretamente com a diferenciação de natureza
function fillPrizeField(selector, premio) {
    const element = document.querySelector(selector);
    if (element && premio) {
        const tipo = premio.tipo || 'Desconhecido';
        const valor = premio.valor || 'Não especificado';

        // Verifica se o tipo contém "Crédito em fatura" e separa a categoria e a natureza
        if (tipo.includes("Crédito em fatura")) {
            const [categoria, natureza] = tipo.split(":"); // Divide o tipo em categoria e natureza
            if (natureza) {
                let displayValue = valor; // Valor a ser exibido

                // Adiciona unidade de acordo com a natureza
                if (natureza.trim() === "valor-fixo") {
                    displayValue = `R$ ${valor}`; // Para valor fixo, adicionar "R$"
                } else if (natureza.trim() === "percentual-compra") {
                    displayValue = `${valor}%`; // Para percentual, adicionar "%"
                }

                element.innerHTML = `<h3>${categoria}: ${displayValue}<br> (${natureza.trim()})</h3>`;
            } else {
                element.innerHTML = `<h3>${categoria}: ${valor} pontos por real</h3>`;
            }
        } else {
            // Para outros tipos de prêmio, exibe apenas o tipo e o valor
            element.innerHTML = `<h3>${tipo}: ${valor} pontos por real</h3>`;
        }
    } else {
        element.innerHTML = `<h3>Informação não disponível</h3>`;
    }
}

// Função para abrir a base de dados do IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CampaignDatabase', 1); // Nome do banco e versão

        request.onerror = (event) => {
            reject('Erro ao abrir o IndexedDB');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result); // Retorna a instância do banco
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('campaigns')) {
                db.createObjectStore('campaigns', { keyPath: 'id' }); // Cria o object store com 'id' como chave
            }
        };
    });
}


// Função para salvar a campanha mais recente do localStorage no IndexedDB
function saveLatestCampaignToIndexedDB() {
    // Recuperar campanhas do localStorage
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];

    // Verificar se há campanhas no localStorage
    if (campaigns.length === 0) {
        console.log('Não há campanhas no localStorage');
        return;
    }

    // Encontrar a campanha com o maior id (mais recente)
    const latestCampaign = campaigns.reduce((max, campaign) => {
        return campaign.id > max.id ? campaign : max;
    });

    openDatabase().then(db => {
        const transaction = db.transaction(['campaigns'], 'readwrite');
        const objectStore = transaction.objectStore('campaigns');

        // Consultar todos os dados para obter o maior ID já existente no IndexedDB
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
            const existingCampaigns = getAllRequest.result;
            // Gerar um novo ID baseado no maior ID existente + 1
            const newId = existingCampaigns.length > 0
                ? Math.max(...existingCampaigns.map(campaign => campaign.id)) + 1
                : 1; // Se não houver campanhas, começamos com o ID 1

            // Atribui o novo ID à campanha
            latestCampaign.id = newId;

            // Adicionar a nova campanha com o ID gerado
            const request = objectStore.add(latestCampaign);

            request.onsuccess = () => {
                console.log(`Campanha com ID ${latestCampaign.id} salva no IndexedDB`);
                
                // Limpar o localStorage após salvar a campanha
                localStorage.removeItem('campaigns');
                console.log('localStorage limpo');
            };

            request.onerror = (event) => {
                console.error(`Erro ao salvar campanha com ID ${latestCampaign.id}:`, event.target.error);
            };
        };

        getAllRequest.onerror = (event) => {
            console.error('Erro ao buscar campanhas do IndexedDB:', event.target.error);
        };
    }).catch(err => {
        console.error('Erro ao abrir o banco de dados:', err);
    });
}

document.getElementById('editar_campanha_button').addEventListener('click', function() {
    event.preventDefault();

    // Recuperar a campanha do localStorage
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const latestCampaign = campaigns.reduce((max, campaign) => {
        return campaign.id > max.id ? campaign : max;
    });

    // Salvar a campanha mais recente no localStorage para ser usada na tela de criação
    localStorage.setItem('editingCampaign', JSON.stringify(latestCampaign));

    // Redirecionar para a página de criação de campanha
    window.location.href = 'criar_campanha.html';
});


// Adiciona o evento de clique ao botão "Criar Campanha"
document.getElementById('criar_campanha_button').addEventListener('click', function() {
    event.preventDefault();

    // Exibe a mensagem de sucesso
    document.getElementById('mensagemSucesso').style.display = 'flex';

    // Oculta o conteúdo da página
    document.getElementById('conteudo').style.display = 'none';

    // Redireciona após 3 segundos
    setTimeout(function() {
        window.location.href = '../index.html';
    }, 3000);
    
    saveLatestCampaignToIndexedDB();
});
