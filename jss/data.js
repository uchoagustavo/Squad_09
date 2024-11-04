// Configura os inputs e validações
const startInputs = {
    day: document.getElementById('start-day'),
    month: document.getElementById('start-month'),
    year: document.getElementById('start-year')
};
const endInputs = {
    day: document.getElementById('end-day'),
    month: document.getElementById('end-month'),
    year: document.getElementById('end-year')
};

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();

function isAnoBissexto(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function validateDay(day, month, year) {
    if (isNaN(day) || day < 1 || day > 31) return false;
    if (month === 2) return day <= (isAnoBissexto(year) ? 29 : 28);
    if ([4, 6, 9, 11].includes(month)) return day <= 30;
    return true;
}

function validateMonth(month) {
    return month >= 1 && month <= 12;
}

function validateYear(year) {
    return year >= currentYear;
}

function isDateValid(day, month, year) {
    if (year === currentYear) {
        if (month < currentMonth) return false;
        if (month === currentMonth && day < currentDay) return false;
    }
    const inputDate = new Date(year, month - 1, day);
    return inputDate >= today;
}

// Validação e erro para um grupo de campos de data
function validateInputs(inputGroup, errorPrefix) {
    const day = parseInt(inputGroup.day.value);
    const month = parseInt(inputGroup.month.value);
    const year = parseInt(inputGroup.year.value);

    document.getElementById(`${errorPrefix}-day-error`).textContent = '';
    document.getElementById(`${errorPrefix}-month-error`).textContent = '';
    document.getElementById(`${errorPrefix}-year-error`).textContent = '';

    let isValid = true;

    if (inputGroup.day.value && (day < 1 || day > 31 || !validateDay(day, month, year))) {
        document.getElementById(`${errorPrefix}-day-error`).textContent = 'Dia inválido para o mês.';
        isValid = false;
    }

    if (inputGroup.month.value && !validateMonth(month)) {
        document.getElementById(`${errorPrefix}-month-error`).textContent = 'Mês inválido (1-12).';
        isValid = false;
    }

    if (inputGroup.year.value && inputGroup.year.value.length === 4 && !validateYear(year)) {
        document.getElementById(`${errorPrefix}-year-error`).textContent = 'Ano inválido.';
        isValid = false;
    }

    if (inputGroup.day.value && inputGroup.month.value && inputGroup.year.value.length === 4 && !isDateValid(day, month, year)) {
        document.getElementById(`${errorPrefix}-day-error`).textContent = 'Data não pode ser anterior a hoje.';
        isValid = false;
    }
}

// Restringir entrada para apenas números e pular ao próximo campo automaticamente
function setupAutoJumpAndValidation(inputGroup, errorPrefix) {
    inputGroup.day.addEventListener('input', function() {
        if (this.value.length === 2) inputGroup.month.focus();
        validateInputs(inputGroup, errorPrefix);
    });

    inputGroup.month.addEventListener('input', function() {
        if (this.value.length === 2) inputGroup.year.focus();
        validateInputs(inputGroup, errorPrefix);
    });

    inputGroup.year.addEventListener('input', function() {
        validateInputs(inputGroup, errorPrefix);
    });

    // Restringe entrada para números
    Object.values(inputGroup).forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (!/\d/.test(event.key) && !['Backspace', 'Delete', 'Tab'].includes(event.key)) {
                event.preventDefault();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupAutoJumpAndValidation(startInputs, 'start');
    setupAutoJumpAndValidation(endInputs, 'end');
});
