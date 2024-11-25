const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Verificar se o tema já foi armazenado no localStorage
if(localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
} else {
    body.classList.remove('light-theme');
}

// Alternar entre os temas
themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');

    if (body.classList.contains('light-theme')) {
        themeToggleBtn.innerHTML = "Alterar Tema";
    } else {
        themeToggleBtn.innerHTML = "Alterar Tema";
    }

    // Armazenar a escolha do tema no localStorage
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});