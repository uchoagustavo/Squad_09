function salvarCampanha() {
    // Capturar os elementos do formulário e seus valores

    // Nome e descrição
    const nome = document.querySelector('nome-campanha').value; // Substituir pelo ID correto
    const descricao = document.querySelector('desc-campanha').value; // Substituir pelo ID correto

    // Imagem (se houver um campo para isso)
    const imagem = document.querySelector('upload-image').value || 'imgs/default.jpg'; // Substituir pelo ID correto

    // Cartões selecionados (checkboxes)
    const cartoesSelecionados = Array.from(document.querySelectorAll('.cartoes input[type="checkbox"]:checked'))
        .map(input => input.value);

    // Mecânica selecionada (radio buttons ou dropdown)
    const mecanicaSelecionada = document.querySelector('input[name="mecanica"]:checked')?.value || '';

    // Fator de categorização (radio buttons ou dropdown)
    const fatorCategorizacao = document.querySelector('input[name="fator"]:checked')?.value || '';

    // Limite de cashback
    const limiteCashback = parseFloat(document.querySelector('#limite-cashback').value) || 0;

    // Estabelecimentos comerciais
    const estabelecimentos = Array.from(document.querySelectorAll('.estabelecimentos input[type="checkbox"]:checked'))
        .map(input => input.value);

    // Dropdowns: MCC, Online e Presencial
    const mccSelecionado = document.querySelector('#mcc-dropdown').value; // Substituir pelo ID correto
    const onlineSelecionado = document.querySelector('#online-dropdown').value; // Substituir pelo ID correto
    const presencialSelecionado = document.querySelector('#presencial-dropdown').value; // Substituir pelo ID correto

    // Criar o objeto da campanha
    const campanha = {
        id: Date.now(),
        nome,
        descricao,
        imagem,
        cartoes: cartoesSelecionados,
        mecanica: mecanicaSelecionada,
        fator: fatorCategorizacao,
        limiteCashback,
        estabelecimentos,
        dropdowns: {
            mcc: mccSelecionado,
            online: onlineSelecionado,
            presencial: presencialSelecionado
        }
    };

    // Recuperar as campanhas salvas no localStorage
    const campanhasSalvas = JSON.parse(localStorage.getItem('campanhas')) || [];

    // Adicionar a nova campanha ao array
    campanhasSalvas.push(campanha);

    // Salvar novamente no localStorage
    localStorage.setItem('campanhas', JSON.stringify(campanhasSalvas));

    // Exibir uma mensagem de sucesso (opcional)
    console.log('Campanha salva com sucesso:', campanha);
}


// Seleciona o botão "Salvar & Continuar"
const btnSalvarContinuar = document.querySelector('.salvar_continuar');

// Adiciona o evento de clique ao botão
btnSalvarContinuar.addEventListener('click', function (event) {
    // Impede o comportamento padrão de envio do formulário
    event.preventDefault();

    // Chama a função salvarCampanha para salvar os dados
    salvarCampanha();
});