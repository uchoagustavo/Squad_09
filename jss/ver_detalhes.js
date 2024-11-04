document.addEventListener("DOMContentLoaded", () => {
    const campanhasList = document.getElementById("campanhas-list");
  
    // Função para recuperar campanhas do localStorage
    function carregarCampanhas() {
      const campanhas = JSON.parse(localStorage.getItem("campanhas")) || [];
  
      if (campanhas.length === 0) {
        campanhasList.innerHTML = "<p>Nenhuma campanha cadastrada.</p>";
        return;
      }
  
      campanhas.forEach(campanha => {
        const card = document.createElement("div");
        card.classList.add("campanha-card");
  
        // Imagem
        const img = document.createElement("img");
        img.src = campanha.imagem || "imagem-padrao.jpg"; // Defina uma imagem padrão, se necessário
        card.appendChild(img);
  
        // Nome e Descrição
        const nome = document.createElement("h2");
        nome.textContent = campanha.nome;
        card.appendChild(nome);
  
        const descricao = document.createElement("p");
        descricao.textContent = campanha.descricao;
        card.appendChild(descricao);
  
        // Período
        const periodo = document.createElement("p");
        periodo.classList.add("campanha-periodo");
        periodo.textContent = `Período: ${campanha.startDay}/${campanha.startMonth}/${campanha.startYear} a ${campanha.endDay}/${campanha.endMonth}/${campanha.endYear}`;
        card.appendChild(periodo);
  
        // Mecânicas
        const mecanicas = document.createElement("p");
        mecanicas.classList.add("campanha-mecanicas");
        mecanicas.textContent = `Mecânicas: ${campanha.mecanicas.join(", ")}`;
        card.appendChild(mecanicas);
  
        // Fator de Categorização
        const categorizacao = document.createElement("p");
        categorizacao.classList.add("campanha-categorizacao");
        categorizacao.textContent = `Fatores: ${campanha.fatorCategorizacao.join(", ")}`;
        card.appendChild(categorizacao);
  
        // Prêmios
        const premios = document.createElement("p");
        premios.classList.add("campanha-premios");
        premios.textContent = `Prêmios: ${campanha.premios.join(", ")}`;
        card.appendChild(premios);
  
        // Elegibilidade
        const elegibilidade = document.createElement("p");
        elegibilidade.classList.add("campanha-elegibilidade");
        elegibilidade.textContent = `Elegibilidade: ${campanha.elegibilidade.join(", ")}`;
        card.appendChild(elegibilidade);
  
        campanhasList.appendChild(card);
      });
    }
  
    // Chamar a função para carregar as campanhas ao iniciar a página
    carregarCampanhas();
  });
  