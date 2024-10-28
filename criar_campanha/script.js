document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.dropdown-item input[type="checkbox"]');
    const selectedItems = document.getElementById('selected-items');
    let paragraphCreated = false;

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const dropdownItem = this.closest('.dropdown-item');
            const itemText = dropdownItem.querySelector('span').textContent.trim();

            if (this.checked) {
                if (!paragraphCreated) {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = "MCC's selecionados:";
                    paragraph.id = 'mcc-paragraph';
                    selectedItems.parentNode.insertBefore(paragraph, selectedItems);
                    paragraphCreated = true;
                }
                // Se o checkbox for marcado, cria um novo item na lista
                if (!document.querySelector(`li[data-value="${itemText}"]`)) {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('data-value', itemText);
                    listItem.innerHTML = `${itemText} <span class="remove-item" style="color: red; cursor: pointer;">&times;</span>`;
                    
                    // Adiciona o evento de click para remover o item
                    listItem.querySelector('.remove-item').addEventListener('click', function() {
                        const checkboxToUncheck = dropdownItem.querySelector('input[type="checkbox"]');
                        checkboxToUncheck.checked = false;
                        selectedItems.removeChild(listItem);

                        // Verifica se ainda há itens selecionados, se não houver, remove o parágrafo
                        if (selectedItems.children.length === 0 && paragraphCreated) {
                            const paragraphToRemove = document.getElementById('mcc-paragraph');
                            if (paragraphToRemove) {
                                paragraphToRemove.remove();
                            }
                            paragraphCreated = false;
                        }
                    });

                    selectedItems.appendChild(listItem);
                }
            } else {
                // Se o checkbox for desmarcado, remove o item da lista
                const listItemToRemove = document.querySelector(`li[data-value="${itemText}"]`);
                if (listItemToRemove) {
                    selectedItems.removeChild(listItemToRemove);
                }
                // Verifica se ainda há itens selecionados, se não houver, remove o parágrafo
                if (selectedItems.children.length === 0 && paragraphCreated) {
                    const paragraphToRemove = document.getElementById('mcc-paragraph');
                    if (paragraphToRemove) {
                        paragraphToRemove.remove();
                    }
                    paragraphCreated = false;
                }
            }
        });
    });
});

const inputGroup = document.querySelector('.input-group-data');
const inputs = document.querySelectorAll('.input-data');
const dia = document.getElementById('day')

//Validações:
// Obter data atual
const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth() + 1; // Janeiro é 0
const currentYear = today.getFullYear();

function isAnoBissexto(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function validateDay(day, month, year) {
     // Verifica se o dia é um número válido (1 a 31)
     if (isNaN(day) || day < 1 || day > 31) {
        return false; // Dia inválido se for menor que 1 ou maior que 31
    }

    // Verifica os limites de dias para cada mês
    if (month) {
        if (month === 2) { // Fevereiro
            return day <= (isAnoBissexto(year) ? 29 : 28); // Verifica se é bissexto
        } else if ([4, 6, 9, 11].includes(month)) { // Meses com 30 dias
            return day <= 30;
        }
    }
    return true; // Se o mês não estiver definido, apenas verificar se o dia é válido
}

function validateMonth(month) {
    return month >= 1 && month <= 12;
}

function validateYear(year) {
    return year >= currentYear
}

function isDateValid(day, month, year) {
    // Se o ano é o mesmo, o mês só pode ser o mesmo ou posterior
    if (year === currentYear) {
        if (month < currentMonth) return false; // Mês anterior
        if (month === currentMonth && day < currentDay) return false; // Dia anterior no mês atual
    }
    
    // Cria uma nova data para validação
    const inputDate = new Date(year, month - 1, day);
    return inputDate >= today; // Verifica se a data inserida é igual ou posterior à data atual
}
function validateInputs() {
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');

    const day = parseInt(dayInput.value);
    const month = parseInt(monthInput.value);
    const year = parseInt(yearInput.value);

    // Limpar mensagens de erro
    document.getElementById('day-error').textContent = '';
    document.getElementById('month-error').textContent = '';
    document.getElementById('year-error').textContent = '';

    let isValid = true;

    // Verificar se todos os campos contêm apenas números
    if (!/^\d*$/.test(dayInput.value)) {
        document.getElementById('day-error').textContent = 'Digite apenas números!';
        dayInput.value = ''; // Limpa o campo se tiver letras
        isValid = false;
    } else {
        document.getElementById('day-error').textContent = ''; // Limpa a mensagem de erro
    }

    if (!/^\d*$/.test(monthInput.value)) {
        document.getElementById('month-error').textContent = 'Digite apenas números!';
        monthInput.value = ''; // Limpa o campo se tiver letras
        isValid = false;
    } else {
        document.getElementById('month-error').textContent = ''; // Limpa a mensagem de erro
    }

    if (!/^\d*$/.test(yearInput.value)) {
        document.getElementById('year-error').textContent = 'Digite apenas números!';
        yearInput.value = ''; // Limpa o campo se tiver letras
        isValid = false;
    } else {
        document.getElementById('year-error').textContent = ''; // Limpa a mensagem de erro
    }

    // Validações separadas
    if (dayInput.value) {
        if (day < 1 || day > 31) {
            document.getElementById('day-error').textContent = 'Dia inválido.';
            isValid = false;
        } else if (!validateDay(day, month, year)) {
            document.getElementById('day-error').textContent = 'Dia inválido para o mês.';
            isValid = false;
        }
    }

    if (monthInput.value && !validateMonth(month)) {
        document.getElementById('month-error').textContent = 'Mês inválido (1-12).';
        isValid = false;
    }

    if (yearInput.value.length === 4) { // Verifica se 4 dígitos foram digitados
        if (!validateYear(year)) {
            document.getElementById('year-error').textContent = 'O ano não pode ser anterior ao ano atual.';
            isValid = false;
        }
    }

    // Verifica se a data é válida apenas se todos os campos estão preenchidos
     if (dayInput.value && monthInput.value && yearInput.value.length === 4) {
        if (!isDateValid(day, month, year)) {
            document.getElementById('day-error').textContent = 'A data não pode ser anterior à data atual.';
            isValid = false;
        }
    }

    // Verifica se algum campo está preenchido para manter a classe 'active'
    const anyFilled = Array.from(inputs).some(input => input.value.trim() !== '');
    if (anyFilled) {
        inputGroup.classList.add('active'); // Mantém a classe se pelo menos um campo estiver preenchido
    } else {
        inputGroup.classList.remove('active'); // Remove a classe se todos os campos estiverem vazios
    }
}

// Função para restringir a entrada a números
function restrictInput(event) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    // Permite apenas números e as teclas de controle
    if (!allowedKeys.includes(event.key) && (event.key < '0' || event.key > '9')) {
        event.preventDefault(); // Impede a entrada
    }
    
    // Verifica se o valor atual mais o novo caractere excede o maxlength
    const input = event.target;
    if (input.value.length >= input.maxLength) {
        event.preventDefault(); // Impede a entrada se já atingiu o maxlength
    }
}

// Adiciona eventos de input
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        inputGroup.classList.add('active'); // Adiciona a classe 'active' ao focar
    });

    input.addEventListener('input', validateInputs); // Valida ao digitar
});

// Verificação ao perder o foco
inputs.forEach(input => {
    input.addEventListener('blur', validateInputs);
});

document.addEventListener('DOMContentLoaded', function() {
    // IDs dos dropdowns
    const dropdownIds = {
        'mcc-dropdown': 'selected-items-mcc',
        'online-dropdown': 'selected-items-online',
        'presencial-dropdown': 'selected-items-presencial'
    };

    Object.keys(dropdownIds).forEach(dropdownId => {
        // Seleciona o dropdown e seus itens
        const dropdown = document.getElementById(dropdownId);
        const checkboxes = dropdown.querySelectorAll('.dropdown-item input[type="checkbox"]');
        const selectedItems = document.getElementById(dropdownIds[dropdownId]);
        let paragraphCreated = false;

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const dropdownItem = this.closest('.dropdown-item');
                const itemText = dropdownItem.querySelector('span').textContent.trim();

                if (this.checked) {
                    if (!paragraphCreated) {
                        const paragraph = document.createElement('p');
                        paragraph.textContent = "Selecionados:";
                        paragraph.id = `mcc-paragraph-${dropdownId}`;
                        selectedItems.parentNode.insertBefore(paragraph, selectedItems);
                        paragraphCreated = true;
                    }
                    // Se o checkbox for marcado, cria um novo item na lista
                    if (!selectedItems.querySelector(`li[data-value="${itemText}"]`)) {
                        const listItem = document.createElement('li');
                        listItem.setAttribute('data-value', itemText);
                        listItem.innerHTML = `${itemText} <span class="remove-item" style="color: red; cursor: pointer;">&times;</span>`;

                        // Adiciona o evento de click para remover o item
                        listItem.querySelector('.remove-item').addEventListener('click', function() {
                            const checkboxToUncheck = dropdownItem.querySelector('input[type="checkbox"]');
                            checkboxToUncheck.checked = false;
                            selectedItems.removeChild(listItem);

                            // Verifica se ainda há itens selecionados, se não houver, remove o parágrafo
                            if (selectedItems.children.length === 0 && paragraphCreated) {
                                const paragraphToRemove = document.getElementById(`mcc-paragraph-${dropdownId}`);
                                if (paragraphToRemove) {
                                    paragraphToRemove.remove();
                                }
                                paragraphCreated = false;
                            }
                        });

                        selectedItems.appendChild(listItem);
                    }
                } else {
                    // Se o checkbox for desmarcado, remove o item da lista
                    const listItemToRemove = selectedItems.querySelector(`li[data-value="${itemText}"]`);
                    if (listItemToRemove) {
                        selectedItems.removeChild(listItemToRemove);
                    }
                    // Verifica se ainda há itens selecionados, se não houver, remove o parágrafo
                    if (selectedItems.children.length === 0 && paragraphCreated) {
                        const paragraphToRemove = document.getElementById(`mcc-paragraph-${dropdownId}`);
                        if (paragraphToRemove) {
                            paragraphToRemove.remove();
                        }
                        paragraphCreated = false;
                    }
                }
            });
        });
    });
});


function toggleCartao(paragraphId, toggleSwitch) {
    const switchTexto = document.getElementById(paragraphId);

    if (toggleSwitch.checked) {
        setTimeout(() => {
            switchTexto.style.color = '#90ee90';
        }, 110);
    } else {
        switchTexto.style.color = '#fff';  // Cor padrão (preto)
    }
};
