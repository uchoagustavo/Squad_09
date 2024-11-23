// Mapeamento dos MCCs e Modos de Entrada
const mccMap = {
    'Alimentos (MCC 5812)': 'Alimentos',
    'Transporte (MCC 4111)': 'Transporte',
    'Saúde (MCC 8011)': 'Saúde'
};

const entradaMap = {
    'E-commerce': 'E-commerce',
    'Chip e senha': 'Chip e senha',
    'Contactless': 'Contactless',
    'Contactless com senha': 'Contactless com senha'
};


document.querySelector('.form-container').addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio do formulário

    console.log('Formulário enviado'); // Verifica se o submit está sendo acionado

    // Geração de ID único para a campanha
    const campaignId = Date.now(); 

    // Mapeamento dos nomes dos cartões e das mecânicas
    const cartoesMap = {
        toggle1: 'Banese Card',
        toggle2: 'Banese Beneficios',
        toggle3: 'Banese Alimentação',
        toggle4: 'BC Elo Nanquim'
    };

    const mecanicasMap = {
        toggle5: 'Mecânica de frequência',
        toggle6: 'Mecânica Transacional',
        toggle7: 'Mecânica de acúmulo'
    };

    const fatoresCategorizacaoMap = {
        toggle8: 'Transações Categorizadas',
        toggle9: 'Portadores Cadastrados + TC'
    };

    // Capturar dados do formulário
    const campaign = {
        id: campaignId,
        nome: document.getElementById('nome-campanha').value,
        descricao: document.getElementById('desc-campanha').value,
        imagem: document.getElementById('preview')?.src || null,
        cartoes: getCheckedValues(['toggle1', 'toggle2', 'toggle3', 'toggle4'], cartoesMap),
        mecanicas: getCheckedValues(['toggle5', 'toggle6', 'toggle7'], mecanicasMap),
        premios: getPremios(),
        limiteCashback: document.getElementById('cashback-limit').value,
        estabelecimento: document.getElementById('estab-come').value,
        periodo: {
            inicio: getDateFromInputs('start'),
            termino: getDateFromInputs('end'),
        },
        fatorCategorizacao: getCheckedValues(['toggle8', 'toggle9'], fatoresCategorizacaoMap),
        mccs: getMCCSelections(), // Seleções dos MCCs
        modosEntrada: getEntradaSelections(), // Seleções dos Modos de Entrada
    };

    console.log(campaign); // Verifique o conteúdo da campanha antes de salvar

    // Salvar no Local Storage
    saveCampaignToLocalStorage(campaign);
});

// Função para pegar valores dos checkboxes
function getCheckedValues(ids, map) {
    return ids.filter(id => document.getElementById(id)?.checked)
              .map(id => map[id] || id); // Usa o mapeamento para mostrar o nome
}

// Função para obter os valores de 'premios'
function getPremios() {
    if (document.getElementById('toggle10').checked) {
        // Crédito em fatura
        const premioValor = document.getElementById('credit-input').value; 
        if (!premioValor) return { tipo: 'Erro', valor: 'Valor para crédito em fatura não inserido.' };
        
        const tipoCredito = document.getElementById('tipo-credito').value;
        if (!tipoCredito) return { tipo: 'Erro', valor: 'Tipo de crédito não selecionado.' };
        
        return { tipo: `Crédito em fatura: ${tipoCredito}`, valor: premioValor };
    } else if (document.getElementById('toggle11').checked) {
        // Pontos Livelo
        const premioValor = document.getElementById('livelo-points').value;
        if (!premioValor) return { tipo: 'Erro', valor: 'Valor de pontos Livelo não inserido.' };
        return { tipo: 'Pontos Livelo', valor: premioValor };
    }

    return { tipo: 'Erro', valor: 'Nenhum tipo de prêmio selecionado.' };
}


// Função para obter as seleções dos MCCs
function getMCCSelections() {
    const mccValues = [];
    const mccItems = document.querySelectorAll('.MCC-dropdown .dropdown-item');

    mccItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            const label = item.querySelector('span').textContent;
            if (mccMap[label]) mccValues.push(mccMap[label]);
        }
    });

    return mccValues;
}

// Função para obter as seleções dos Modos de Entrada
function getEntradaSelections() {
    const entradaValues = [];
    const entradaItems = document.querySelectorAll('#entrada-dropdown .dropdown-item');
    
    entradaItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            const label = item.querySelector('span').textContent;
            entradaValues.push(label);
        }
    });

    return entradaValues;
}

// Função para pegar a data de entrada de forma mais robusta
function getDateFromInputs(prefix) {
    const dayInput = document.getElementById(`${prefix}-day`);
    const monthInput = document.getElementById(`${prefix}-month`);
    const yearInput = document.getElementById(`${prefix}-year`);

    if (dayInput && monthInput && yearInput) {
        const day = dayInput.value.padStart(2, '0');
        const month = monthInput.value.padStart(2, '0');
        const year = yearInput.value;
        return `${day}/${month}/${year}`;
    }
    return null;
}

// Função para salvar a campanha no localStorage com ID gerado com base no índice
function saveCampaignToLocalStorage(campaign) {
    // Obtém todas as campanhas salvas no localStorage (se houver)
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];

    // Gera o ID com base no número de campanhas já salvas
    const newId = campaigns.length + 1;

    // Atribui o novo ID à campanha
    campaign.id = newId;
    
    // Ajusta a estrutura de premios para garantir que seja um objeto bem formatado
    campaign.premios = getPremios(); 

    // Adiciona a nova campanha ao array
    campaigns.push(campaign);

    // Salva novamente o array de campanhas no localStorage
    localStorage.setItem('campaigns', JSON.stringify(campaigns));

    console.log('Campanha salva no localStorage', campaign);
}
document.addEventListener('DOMContentLoaded', function () {
    // Obter todas as campanhas salvas no localStorage
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];

    // Mapeamentos dos toggles
    const maps = {
        cartoes: {
            toggle1: 'Banese Card',
            toggle2: 'Banese Beneficios',
            toggle3: 'Banese Alimentação',
            toggle4: 'BC Elo Nanquim'
        },
        mecanicas: {
            toggle5: 'Mecânica de frequência',
            toggle6: 'Mecânica Transacional',
            toggle7: 'Mecânica de acúmulo'
        },
        fatoresCategorizacao: {
            toggle8: 'Transações Categorizadas',
            toggle9: 'Portadores Cadastrados + TC'
        },
        mccs: {
            mccAlimentos: 'Alimentos',
            mccTransporte: 'Transporte',
            mccSaude: 'Saúde'
        },
        modosEntrada: {
            entradaEcommerce: 'E-commerce',
            entradaChipSenha: 'Chip e senha',
            entradaContactless: 'Contactless',
            entradaContactlessSenha: 'Contactless com senha'
        }
    };

    // Função para preencher os toggles com base no mapa e nos dados da campanha
    function preencherToggles(map, items) {
        if (items) {
            items.forEach(item => {
                for (let key in map) {
                    if (map[key] === item) {
                        const toggle = document.getElementById(key);
                        if (toggle) toggle.checked = true;
                    }
                }
            });
        }
    }

    // Função para preencher os dropdowns
    function preencherDropdown(map, items, dropdownId) {
        const selectedItemsList = document.querySelector(`#selected-items-${dropdownId}`);
        console.log(`Preenchendo dropdown para ${dropdownId}...`);

        if (items) {
            items.forEach(item => {
                console.log(`Verificando item: ${item}`);
                for (let key in map) {
                    console.log(`Comparando item: ${item} com valor: ${map[key]} (chave: ${key})`);
                    if (map[key] === item) {
                        console.log(`Item encontrado! Marcando checkbox ${key} e adicionando à lista`);
                        const checkbox = document.getElementById(key);
                        if (checkbox) {
                            checkbox.checked = true;
                            console.log(`Checkbox ${key} marcado.`);
                        } else {
                            console.log(`Checkbox ${key} não encontrado.`);
                        }
                        const listItem = document.createElement('li');
                        listItem.textContent = map[key];
                        selectedItemsList.appendChild(listItem);
                    }
                }
            });
        } else {
            console.log('Nenhum item encontrado para preencher.');
        }
    }
    // Verificar se há campanhas no localStorage
    if (campaigns.length > 0) {
        const editingCampaign = campaigns[campaigns.length - 1];  // Última campanha
        console.log('Estrutura de dados da campanha no localStorage:', editingCampaign);
        console.log('Campanha sendo editada:', editingCampaign);
        // Preencher os campos de texto da campanha
        document.querySelector('#nome-campanha').value = editingCampaign.nome || '';
        document.querySelector('#desc-campanha').value = editingCampaign.descricao || '';
        document.querySelector('#cashback-limit').value = editingCampaign.limiteCashback || '';
        document.querySelector('#estab-come').value = editingCampaign.estabelecimento || '';
        preencherDropdown(maps.mccs, editingCampaign.mccs, 'mcc');
        preencherDropdown(maps.modosEntrada, editingCampaign.modosEntrada, 'entrada');
        // Marcar os toggles para cartões, mecânicas e fatores de categorização
        preencherToggles(maps.cartoes, editingCampaign.cartoes);
        preencherToggles(maps.mecanicas, editingCampaign.mecanicas);
        preencherToggles(maps.fatoresCategorizacao, editingCampaign.fatorCategorizacao);
        // Preencher os dropdowns MCC e Entrada
        
        function getMCCSelections() {
            const mccValues = [];
            const mccItems = document.querySelectorAll('.MCC-dropdown .dropdown-item');
        
            mccItems.forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    const label = item.querySelector('span').textContent.trim(); // Garantir que não há espaços extras
        
                    // Log para verificar o valor do label
                    console.log(`Label encontrado: ${label}`);
                    
                    // Verificando se o mccMap possui esse label
                    if (mccMap[label]) {
                        console.log(`Adicionando ao mccValues: ${mccMap[label]}`);
                        mccValues.push(mccMap[label]);
                    } else {
                        console.log(`Nenhum valor encontrado no mccMap para: ${label}`);
                    }
                }
            });
        
            return mccValues;
        }
             
        // Preencher as datas
        if (editingCampaign.periodo) {
            const [startDay, startMonth, startYear] = editingCampaign.periodo.inicio.split('/');
            document.getElementById('start-day').value = startDay;
            document.getElementById('start-month').value = startMonth;
            document.getElementById('start-year').value = startYear;

            const [endDay, endMonth, endYear] = editingCampaign.periodo.termino.split('/');
            document.getElementById('end-day').value = endDay;
            document.getElementById('end-month').value = endMonth;
            document.getElementById('end-year').value = endYear;
        }

        // Verificar se o campo de premios existe e está correto
        console.log("Premios:", editingCampaign.premios);  // Verifique o conteúdo do campo premios

        if (editingCampaign.premios && Object.keys(editingCampaign.premios).length > 0) {
            const premio = editingCampaign.premios;
            getMCCSelections();   
            // Ativar o toggle correto com base no tipo de prêmio
            if (premio.tipo.includes("Crédito em fatura")) {
                const toggleCredito = document.getElementById('toggle10');
                if (toggleCredito) {
                    toggleCredito.checked = true; // Ativa o toggle
                    toggleCreditOption(); // Mostra as opções de crédito em fatura
                }
        
                // Ativar o tipo de crédito (valor-fixo ou percentual-compra)
                const tipoCredito = premio.tipo.split(":")[1]?.trim();
                if (tipoCredito === "valor-fixo") {
                    selecionarTipoCredito("valor-fixo");
                } else if (tipoCredito === "percentual-compra") {
                    selecionarTipoCredito("percentual-compra");
                }
        
                // Preencher o valor no input de crédito
                const creditInput = document.getElementById('credit-input');
                if (creditInput) {
                    creditInput.value = premio.valor || '';
                    creditInput.disabled = false;
                }
            } else if (premio.tipo.includes("Pontos Livelo")) {
                const toggleLivelo = document.getElementById('toggle11');
                if (toggleLivelo) {
                    toggleLivelo.checked = true; // Ativa o toggle
                    toggleLiveloPoints(); // Mostra o input de pontos Livelo
                }
        
                // Preencher o valor no input de pontos Livelo
                const liveloPointsInput = document.getElementById('livelo-points');
                if (liveloPointsInput) {
                    liveloPointsInput.value = premio.valor || '';
                    liveloPointsInput.disabled = false;
                }
            }
        }        

        // Limpar a chave de edição após preencher os campos
        localStorage.removeItem('editingCampaign');
    } else {
        console.log("Nenhuma campanha encontrada para editar.");
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // Mapeamentos dos toggles
    const maps = {
        cartoes: {
            toggle1: 'Banese Card',
            toggle2: 'Banese Beneficios',
            toggle3: 'Banese Alimentação',
            toggle4: 'BC Elo Nanquim'
        },
        mecanicas: {
            toggle5: 'Mecânica de frequência',
            toggle6: 'Mecânica Transacional',
            toggle7: 'Mecânica de acúmulo'
        },
        fatoresCategorizacao: {
            toggle8: 'Transações Categorizadas',
            toggle9: 'Portadores Cadastrados + TC'
        },
        mccs: {
            mccAlimentos: 'Alimentos',
            mccTransporte: 'Transporte',
            mccSaude: 'Saúde'
        },
        modosEntrada: {
            entradaEcommerce: 'E-commerce',
            entradaChipSenha: 'Chip e senha',
            entradaContactless: 'Contactless',
            entradaContactlessSenha: 'Contactless com senha'
        }
    };
    // Função para preencher os toggles com base no mapa e nos dados da campanha
    function preencherToggles(map, items) {
        if (items) {
            items.forEach(item => {
                for (let key in map) {
                    if (map[key] === item) {
                        const toggle = document.getElementById(key);
                        if (toggle) toggle.checked = true;
                    }
                }
            });
        }
    }

    // Função para preencher os dropdowns
    function preencherDropdown(map, items, dropdownId) {
        const selectedItemsList = document.querySelector(`#selected-items-${dropdownId}`);
        console.log(`Preenchendo dropdown para ${dropdownId}...`);

        if (items) {
            items.forEach(item => {
                console.log(`Verificando item: ${item}`);
                for (let key in map) {
                    console.log(`Comparando item: ${item} com valor: ${map[key]} (chave: ${key})`);
                    if (map[key] === item) {
                        console.log(`Item encontrado! Marcando checkbox ${key} e adicionando à lista`);
                        const checkbox = document.getElementById(key);
                        if (checkbox) {
                            checkbox.checked = true;
                            console.log(`Checkbox ${key} marcado.`);
                        } else {
                            console.log(`Checkbox ${key} não encontrado.`);
                        }
                        const listItem = document.createElement('li');
                        listItem.textContent = map[key];
                        selectedItemsList.appendChild(listItem);
                    }
                }
            });
        } else {
            console.log('Nenhum item encontrado para preencher.');
        }
    }
    // Função para obter o ID da campanha a partir da URL
    function getCampaignIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    const campaignId = getCampaignIdFromURL();
    console.log('Campaign ID da URL:', campaignId);  // Verificar o campaignId

    if (campaignId) {
        // A partir do campaignId, vamos buscar os dados no IndexedDB
        const request = window.indexedDB.open('CampaignDatabase', 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            console.log('IndexedDB aberto com sucesso.');

            const transaction = db.transaction(['campaigns'], 'readwrite');
            const objectStore = transaction.objectStore('campaigns');
            const getRequest = objectStore.get(Number(campaignId));  // Garantir que o ID seja um número

            getRequest.onsuccess = function () {
                const campanha = getRequest.result;
                console.log('Campanha recuperada do IndexedDB:', campanha);

                if (campanha) {
                    // Preencher os campos da campanha
                    document.querySelector('#nome-campanha').value = campanha.nome || '';
                    document.querySelector('#desc-campanha').value = campanha.descricao || '';
                    document.querySelector('#cashback-limit').value = campanha.limiteCashback || '';
                    document.querySelector('#estab-come').value = campanha.estabelecimento || '';

                    // Preencher os dropdowns e toggles
                    preencherDropdown(maps.mccs, campanha.mccs, 'mcc');
                    preencherDropdown(maps.modosEntrada, campanha.modosEntrada, 'entrada');
                    preencherToggles(maps.cartoes, campanha.cartoes);
                    preencherToggles(maps.mecanicas, campanha.mecanicas);
                    preencherToggles(maps.fatoresCategorizacao, campanha.fatorCategorizacao);

                    // Preencher as datas
                    if (campanha.periodo) {
                        const [startDay, startMonth, startYear] = campanha.periodo.inicio.split('/');
                        document.getElementById('start-day').value = startDay;
                        document.getElementById('start-month').value = startMonth;
                        document.getElementById('start-year').value = startYear;

                        const [endDay, endMonth, endYear] = campanha.periodo.termino.split('/');
                        document.getElementById('end-day').value = endDay;
                        document.getElementById('end-month').value = endMonth;
                        document.getElementById('end-year').value = endYear;
                    }

                    // Preencher os campos de prêmios
                    if (campanha.premios && Object.keys(campanha.premios).length > 0) {
                        const premio = campanha.premios;
                        getMCCSelections();

                        if (premio.tipo.includes("Crédito em fatura")) {
                            const toggleCredito = document.getElementById('toggle10');
                            if (toggleCredito) {
                                toggleCredito.checked = true; // Ativa o toggle
                                toggleCreditOption(); // Mostra as opções de crédito em fatura
                            }

                            const tipoCredito = premio.tipo.split(":")[1]?.trim();
                            if (tipoCredito === "valor-fixo") {
                                selecionarTipoCredito("valor-fixo");
                            } else if (tipoCredito === "percentual-compra") {
                                selecionarTipoCredito("percentual-compra");
                            }

                            const creditInput = document.getElementById('credit-input');
                            if (creditInput) {
                                creditInput.value = premio.valor || '';
                                creditInput.disabled = false;
                            }
                        } else if (premio.tipo.includes("Pontos Livelo")) {
                            const toggleLivelo = document.getElementById('toggle11');
                            if (toggleLivelo) {
                                toggleLivelo.checked = true; // Ativa o toggle
                                toggleLiveloPoints(); // Mostra o input de pontos Livelo
                            }

                            const liveloPointsInput = document.getElementById('livelo-points');
                            if (liveloPointsInput) {
                                liveloPointsInput.value = premio.valor || '';
                                liveloPointsInput.disabled = false;
                            }
                        }
                    }
                } else {
                    console.log('Campanha não encontrada no IndexedDB com o ID:', campaignId);
                }
            };

            getRequest.onerror = function () {
                console.error('Erro ao buscar a campanha no IndexedDB. campaignId:', campaignId);
            };
        };

        request.onerror = function () {
            console.error('Erro ao abrir o IndexedDB.');
        };
    } else {
        console.log('Nenhum ID de campanha encontrado na URL.');
    }
});
