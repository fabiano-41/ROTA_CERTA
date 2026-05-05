// ================= DADOS =================
let entregas = [
  { nome: "João Silva", endereco: "Rua A, 120", obs: "Cliente em casa", status: "pendente" },
  { nome: "Maria Souza", endereco: "Rua B, 45", obs: "Entregar na portaria", status: "pendente" },
  { nome: "Luis Saulo", endereco: "Rua C, Centro", obs: "Cliente não estava", status: "entregue" }
];

let mapaCriado = false;

// ================= LOGIN =================
function entrar() {
  let email = document.getElementById("email").value;
  let senha = document.getElementById("senha").value;
  let tipo = document.querySelector('input[name="tipo"]:checked');

  if (!email || !senha) {
    alert("Preencha email e senha");
    return;
  }

  if (!tipo) {
    alert("Escolha se você é cliente ou motorista");
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("sistema").style.display = "flex";

  criarMapa();

  if (tipo.value === "motorista") {
    document.getElementById("menuMotorista").style.display = "flex";
    document.getElementById("menuCliente").style.display = "none";
    mostrarTela("localizacao");
    render();
  } else {
    document.getElementById("menuMotorista").style.display = "none";
    document.getElementById("menuCliente").style.display = "flex";
    mostrarTela("cliente");
  }
}

// ================= SAIR =================
function sair() {
  document.getElementById("sistema").style.display = "none";
  document.getElementById("login").style.display = "block";
}

// ================= TROCAR TELAS =================
function mostrarTela(tela) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(tela).classList.add("ativa");

  if (tela === "localizacao") {
    setTimeout(() => {
      if (window.mapa) window.mapa.invalidateSize();
    }, 200);
  }

  render();
}

// ================= MAPA =================
function criarMapa() {
  if (mapaCriado) return;

  window.mapa = L.map("map").setView([-19.5189, -42.6289], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(window.mapa);

  L.marker([-19.5189, -42.6289]).addTo(window.mapa)
    .bindPopup("Motorista aqui")
    .openPopup();

  mapaCriado = true;
}

// ================= RENDER =================
function render() {
  let lista = document.getElementById("listaEntregas");
  let concluidas = document.getElementById("listaConcluidas");
  let historico = document.getElementById("historicoLista");

  if (!lista || !concluidas || !historico) return;

  lista.innerHTML = "";
  concluidas.innerHTML = "";
  historico.innerHTML = "";

  entregas.forEach((e, i) => {
    let icone = e.status === "entregue" ? "fa-circle-check" : "fa-truck";
    let status = e.status === "entregue" ? "Entregue" : "Pendente";

    let card = `
      <div class="card">
        <b><i class="fa-solid ${icone}"></i> ${e.nome}</b><br><br>
        📍 ${e.endereco}<br>
        📝 ${e.obs}<br>
        <b>Status:</b> ${status}<br>

        ${e.status !== "entregue" ? `
          <button onclick="finalizar(${i})">
            ✔ Marcar como entregue
          </button>
        ` : ""}
      </div>
    `;

    if (e.status === "entregue") {
      concluidas.innerHTML += card;
    } else {
      lista.innerHTML += card;
    }

    historico.innerHTML += card;
  });
}

// ================= FINALIZAR =================
function finalizar(i) {
  entregas[i].status = "entregue";
  render();
  alert("Entrega finalizada!");
}

// ================= CADASTRO =================
function criarEntrega() {
  let nome = document.getElementById("nome").value;
  let endereco = document.getElementById("endereco").value;
  let obs = document.getElementById("obs").value;

  if (!nome || !endereco) {
    alert("Preencha nome e endereço");
    return;
  }

  entregas.push({
    nome,
    endereco,
    obs: obs || "Sem observação",
    status: "pendente"
  });

  document.getElementById("nome").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("obs").value = "";

  mostrarTela("entregas");
}

// ================= CLIENTE =================
function acompanharEntrega() {
  mostrarTela("localizacao");

  setTimeout(() => {
    if (window.mapa) window.mapa.invalidateSize();
  }, 200);
}

// ================= PEDIDO CLIENTE =================
function fazerPedido() {
  let pedido = document.getElementById("pedidoCliente").value;
  let endereco = document.getElementById("enderecoCliente").value;
  let listaPedidos = document.getElementById("pedidosCliente");

  if (!pedido || !endereco) {
    alert("Preencha o pedido e o endereço");
    return;
  }

  // aparece para o cliente
  listaPedidos.innerHTML += `
    <div class="card">
      <b>🛒 Pedido feito</b><br><br>
      📦 ${pedido}<br>
      📍 ${endereco}<br>
      <b>Status:</b> Aguardando motorista
    </div>
  `;

  // envia para o motorista
  entregas.push({
    nome: pedido,
    endereco: endereco,
    obs: "Pedido do cliente",
    status: "pendente"
  });

  render();

  document.getElementById("pedidoCliente").value = "";
  document.getElementById("enderecoCliente").value = "";

  alert("Pedido enviado para o motorista!");
}
