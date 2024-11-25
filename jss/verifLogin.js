// Verifica se o usuário está autenticado ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated || isAuthenticated !== "true") {
        // Redireciona para a página de login se não estiver autenticado
        window.location.href = "htmls/login.html"; // Caminho correto para a página de login
    }
});