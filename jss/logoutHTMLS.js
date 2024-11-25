document.getElementById("logoutButton").addEventListener("click", function() {
    // Remove o estado de autenticação do localStorage
    localStorage.removeItem("isAuthenticated");

    // Redireciona para a página de login
    window.location.href = "login.html"; // Ajuste o caminho conforme necessário
});