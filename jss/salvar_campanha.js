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

    // Salvar no localStorage
    saveCampaignToLocalStorage(campaign);
    alert('Campanha salva com sucesso!');
});


// Função para pegar valores dos checkboxes
function getCheckedValues(ids, map) {
    return ids.filter(id => document.getElementById(id)?.checked)
              .map(id => map[id] || id); // Usa o mapeamento para mostrar o nome
}// Função para obter os valores de 'premios'
function getPremios() {
    let premioValor = '';

    // Se o prêmio for 'Crédito em fatura' (caso o checkbox esteja marcado)
    if (document.getElementById('toggle10').checked) {
        premioValor = document.getElementById('credit-input').value; // Captura o valor inserido para o crédito em fatura

        // Verifica se o valor foi preenchido
        if (!premioValor) {
            return 'Erro: Valor para crédito em fatura não inserido.';
        }

        const tipoCredito = document.getElementById('tipo-credito').value; // Agora acessamos o valor do input oculto
        
        // Verifica se o tipo de crédito foi selecionado
        if (!tipoCredito) {
            return 'Erro: Tipo de crédito não selecionado.';
        }

        // Retorna o prêmio com o tipo e valor
        return `Crédito em fatura: ${tipoCredito} - Valor: ${premioValor}`;
    } 
    // Se o prêmio for 'Pontos Livelo' (caso o checkbox esteja marcado)
    else if (document.getElementById('toggle11').checked) {
        premioValor = document.getElementById('livelo-points').value; // Captura o valor dos pontos Livelo
        
        // Verifica se o valor foi preenchido
        if (!premioValor) {
            return 'Erro: Valor de pontos Livelo não inserido.';
        }

        // Retorna o prêmio com os pontos Livelo
        return `Pontos Livelo - Valor: ${premioValor}`;
    }

    // Se nenhum prêmio foi selecionado
    return 'Erro: Nenhum tipo de prêmio selecionado.';
}

// Função para obter as seleções dos MCCs
function getMCCSelections() {
    const mccValues = [];
    const mccItems = document.querySelectorAll('.MCC-dropdown .dropdown-item');

    mccItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            const label = item.querySelector('span').textContent;
            // Verifica se é um MCC e adiciona ao array
            if (mccMap[label]) {
                mccValues.push(mccMap[label]);
            }
        }
    });

    return mccValues;
}

// Função para obter as seleções dos Modos de Entrada
function getEntradaSelections() {
    const entradaValues = [];
    
    // Selecione todos os itens com a classe .dropdown-item dentro de .entrada-dropdown
    const entradaItems = document.querySelectorAll('#entrada-dropdown .dropdown-item');
    
    // Verifique cada item
    entradaItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');  // Encontre o checkbox dentro de cada item
        
        if (checkbox && checkbox.checked) {
            const label = item.querySelector('span').textContent;  // Obtenha o texto do modo de entrada

            // Adicione ao array se estiver marcado
            entradaValues.push(label);  // Adicione o nome diretamente, sem precisar do mapa se não for necessário
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
        // Retorna a data formatada como YYYY-MM-DD
        const day = dayInput.value.padStart(2, '0'); // Adiciona 0 à esquerda para garantir 2 dígitos
        const month = monthInput.value.padStart(2, '0'); // Mesma coisa para o mês
        const year = yearInput.value;
        return `${day}-${month}-${year}`;
    }
    return null;
}

// Função para salvar a campanha no localStorage
function saveCampaignToLocalStorage(campaign) {
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    campaigns.push(campaign);
    localStorage.setItem('campaigns', JSON.stringify(campaigns));

    console.log('Campanha salva no localStorage');
}
