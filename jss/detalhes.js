document.addEventListener('DOMContentLoaded', function () {
    function loadCampaignById() {
        // Obter o ID da campanha da URL
        const params = new URLSearchParams(window.location.search);
        const campaignId = parseInt(params.get('id'), 10);

        if (isNaN(campaignId)) {
            console.error('ID da campanha inválido ou não fornecido.');
            return;
        }

        // Abre o banco de dados IndexedDB
        const request = indexedDB.open('CampaignDatabase', 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('campaigns')) {
                db.createObjectStore('campaigns', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function (event) {
            const db = event.target.result;

            // Inicia uma transação para leitura
            const transaction = db.transaction('campaigns', 'readonly');
            const store = transaction.objectStore('campaigns');

            // Obtém a campanha com o ID fornecido
            const getRequest = store.get(campaignId);

            getRequest.onsuccess = function () {
                const campaign = getRequest.result;

                if (!campaign) {
                    console.error('Nenhuma campanha encontrada com o ID fornecido.');
                    return;
                }

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
                fillField('.nome-campanha', campaign.nome);

                // Preencher Descrição
                fillField('.descricao-campanha', campaign.descricao);

                // Preencher Imagem
                const imgElement = document.querySelector('.img');
                if (imgElement) {
                    imgElement.innerHTML = `<img src="${campaign.imagem || ''}" alt="Imagem da campanha" style="max-width: 100%; height: auto;">`;
                }

                // Preencher cartões
                fillField('.cartoesCampanha', campaign.cartoes, true);

                // Preencher mecânicas
                fillField('.mecanicaCampanha', campaign.mecanicas, true);

                // Exemplo de como você aplicaria isso para prêmios
                fillPrizeField('.premioCampanha', campaign.premios);

                // Preencher limite de cashback
                fillField('.limiteCashbackCampanha', campaign.limiteCashback);

                // Preencher estabelecimento comercial
                fillField('.estabelecimentosComerciaisCampanha', campaign.estabelecimento);

                // Preencher período (datas de início e término)
                fillField('.dataInicioCampanha', campaign.periodo?.inicio);
                fillField('.dataTerminoCampanha', campaign.periodo?.termino);

                // Preencher fator de categorização
                fillField('.categorizacaoCampanha', campaign.fatorCategorizacao, true);

                // Preencher MCCs
                fillField('.MCCSCampanha', campaign.mccs, true);

                // Preencher modos de entrada
                fillField('.modosEntradaCampanha', campaign.modosEntrada, true);
            };

            getRequest.onerror = function () {
                console.error('Erro ao buscar campanha no IndexedDB.');
            };
        };

        request.onerror = function () {
            console.error('Erro ao abrir o banco de dados IndexedDB.');
        };
    }

    loadCampaignById();
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
