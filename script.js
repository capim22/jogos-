
const firebaseConfig = {
  apiKey: "AIzaSyACUpW8INZOyd4A0AZ4Ndqv7uM3h0FZYK8",
  authDomain: "capim-jogo-da-velha.firebaseapp.com",
  databaseURL: "https://capim-jogo-da-velha-default-rtdb.firebaseio.com",
  projectId: "capim-jogo-da-velha",
  storageBucket: "capim-jogo-da-velha.appspot.com",
  messagingSenderId: "89311283108",
  appId: "1:89311283108:web:047749fd2c081f727a2331"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const urlParams = new URLSearchParams(window.location.search);
const sala = urlParams.get('sala');
const nome = urlParams.get('nome');
document.getElementById('titulo').innerText = `Sala ${sala} - Jogador: ${nome}`;

const tabuleiro = document.getElementById("tabuleiro");
const mensagensDiv = document.getElementById("mensagens");
const mensagemInput = document.getElementById("mensagem");

for (let i = 0; i < 9; i++) {
  const celula = document.createElement("div");
  celula.className = "celula";
  celula.dataset.index = i;
  celula.onclick = () => jogar(i);
  tabuleiro.appendChild(celula);
}

function renderTabuleiro(estado) {
  for (let i = 0; i < 9; i++) {
    tabuleiro.children[i].innerText = estado[i] || "";
  }
}

function jogar(pos) {
  const ref = db.ref(`salas/${sala}/jogo`);
  ref.once("value").then(snapshot => {
    let estado = snapshot.val() || Array(9).fill("");
    if (estado[pos] === "") {
      estado[pos] = nome;
      ref.set(estado);
    }
  });
}

db.ref(`salas/${sala}/jogo`).on("value", snapshot => {
  renderTabuleiro(snapshot.val() || Array(9).fill(""));
});

function enviarMensagem() {
  const texto = mensagemInput.value.trim();
  if (texto) {
    db.ref(`salas/${sala}/chat`).push(`${nome}: ${texto}`);
    mensagemInput.value = "";
  }
}

db.ref(`salas/${sala}/chat`).on("child_added", snapshot => {
  const msg = document.createElement("div");
  msg.innerText = snapshot.val();
  mensagensDiv.appendChild(msg);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
});
