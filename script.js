 // Lista inicial de entregas
    let entregas = [
      { nome: "João Silva", endereco: "Rua A, 120", obs: "Cliente em casa", status: "pendente" },
      { nome: "Maria Souza", endereco: "Rua B, 45", obs: "Entregar na portaria", status: "pendente" },
      { nome: "Luis Saulo", endereco: "Rua C, Centro", obs: "Cliente não estava", status: "entregue" }
    ];


    let mapaCriado = false;

    function entrar() {
      let usuario = document.getElementById("usuario").value;
      let senha = document.getElementById("senha").value;

      // Verifica se os campos foram preenchidos
      if (!usuario || !senha) {
        alert("Preencha nome e senha");
        return;
      }

      // Esconde o login e mostra o sistema
      document.getElementById("login").style.display = "none";
      document.getElementById("sistema").style.display = "block";

      // Cria o mapa e carrega as entregas
      criarMapa();
      render();
    }

    // Função para sair do sistema
    function sair() {
      document.getElementById("sistema").style.display = "none";
      document.getElementById("login").style.display = "block";
    }

    // Função para trocar de tela
    function mostrarTela(tela) {
      // Remove a classe ativa de todas as telas
      document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));

      // Ativa apenas a tela escolhida
      document.getElementById(tela).classList.add("ativa");

      // Corrige o tamanho do mapa quando volta para ele
      if (tela === "localizacao") {
        setTimeout(() => {
          if (window.mapa) window.mapa.invalidateSize();
        }, 200);
      }

      // Atualiza as listas
      render();
    }

    
    function criarMapa() {
      // Impede criar o mapa mais de uma vez
      if (mapaCriado) return;

     
      window.mapa = L.map("map").setView([-19.5189, -42.6289], 14);

    
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(window.mapa);

      // Marcador do motorista
      L.marker([-19.5189, -42.6289]).addTo(window.mapa)
        .bindPopup("Motorista aqui")
        .openPopup();

      // Marcador da entrega do João
      L.marker([-19.5220, -42.6250]).addTo(window.mapa)
        .bindPopup("Entrega: João Silva");

      // Marcador da entrega da Maria
      L.marker([-19.5150, -42.6320]).addTo(window.mapa)
        .bindPopup("Entrega: Maria Souza");

      // Marca que o mapa já foi criado
      mapaCriado = true;
    }

    // Função que desenha as entregas na tela
    function render() {
      let lista = document.getElementById("listaEntregas");
      let concluidas = document.getElementById("listaConcluidas");
      let historico = document.getElementById("historicoLista");

      // Limpa as listas antes de carregar novamente
      lista.innerHTML = "";
      concluidas.innerHTML = "";
      historico.innerHTML = "";

      // Passa por cada entrega da lista
      entregas.forEach((e, i) => {
        let icone = e.status === "entregue" ? "fa-circle-check" : "fa-truck";
        let textoStatus = e.status === "entregue" ? "Entregue" : "Pendente";

        // Cria o card da entrega
        let card = `
          <div class="card">
            <b><i class="fa-solid ${icone}"></i> ${e.nome}</b><br><br>
            <i class="fa-solid fa-location-dot"></i> ${e.endereco}<br>
            <i class="fa-solid fa-comment"></i> ${e.obs}<br>
            <b>Status:</b> ${textoStatus}<br>

            ${e.status !== "entregue" ? `
              <button onclick="finalizar(${i})">
                <i class="fa-solid fa-check"></i> Marcar como entregue
              </button>
            ` : ""}
          </div>
        `;

        // Se estiver entregue, vai para concluídas
        if (e.status === "entregue") {
          concluidas.innerHTML += card;
        } else {
          lista.innerHTML += card;
        }

        // Histórico mostra todas as entregas
        historico.innerHTML += card;
      });
    }

    // Função para finalizar uma entrega
    function finalizar(i) {
      entregas[i].status = "entregue";
      render();
      alert("Entrega finalizada!");
    }

    // Função para criar uma nova entrega
    function criarEntrega() {
      let nome = document.getElementById("nome").value;
      let endereco = document.getElementById("endereco").value;
      let obs = document.getElementById("obs").value;

      // Verifica se nome e endereço foram preenchidos
      if (!nome || !endereco) {
        alert("Preencha nome e endereço");
        return;
      }

      // Adiciona a nova entrega na lista
      entregas.push({
        nome,
        endereco,
        obs: obs || "Sem observação",
        status: "pendente"
      });

      // Limpa os campos depois de salvar
      document.getElementById("nome").value = "";
      document.getElementById("endereco").value = "";
      document.getElementById("obs").value = "";

      // Vai para a tela de entregas
      mostrarTela("entregas");
    }