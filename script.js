// Firebase Config
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
const sala = urlParams.get("sala");
const nome = urlParams.get("nome") || "Anon";

document.getElementById("titulo").innerText = `Sala ${sala} - Jogador: ${nome}`;

// Jogo da velha
const tabuleiro = document.getElementById("tabuleiro");
let jogada = "X";
let podeJogar = true;

for (let i = 0; i < 3; i++) {
  const row = tabuleiro.insertRow();
  for (let j = 0; j < 3; j++) {
    const cell = row.insertCell();
    cell.dataset.pos = i + "-" + j;
    cell.onclick = () => jogar(cell);
  }
}

function jogar(cell) {
  if (!podeJogar || cell.textContent) return;
  cell.textContent = jogada;
  verificarVitoria();
  jogada = jogada === "X" ? "O" : "X";
}

function verificarVitoria() {
  const pos = (i, j) => tabuleiro.rows[i].cells[j].textContent;
  for (let i = 0; i < 3; i++) {
    if (pos(i, 0) && pos(i, 0) === pos(i, 1) && pos(i, 1) === pos(i, 2)) fim(pos(i, 0));
    if (pos(0, i) && pos(0, i) === pos(1, i) && pos(1, i) === pos(2, i)) fim(pos(0, i));
  }
  if (pos(0, 0) && pos(0, 0) === pos(1, 1) && pos(1, 1) === pos(2, 2)) fim(pos(0, 0));
  if (pos(0, 2) && pos(0, 2) === pos(1, 1) && pos(1, 1) === pos(2, 0)) fim(pos(0, 2));
}

function fim(vencedor) {
  alert("Vitória de " + vencedor);
  podeJogar = false;
}

// Chat
const mensagensDiv = document.getElementById("mensagens");

firebase.database().ref("salas/" + sala + "/chat").on("child_added", function (snap) {
  const dado = snap.val();
  const p = document.createElement("p");
  p.innerText = dado.nome + ": " + dado.texto;
  mensagensDiv.appendChild(p);
});

function enviar() {
  const msg = document.getElementById("mensagem");
  if (!msg.value.trim()) return;
  firebase.database().ref("salas/" + sala + "/chat").push({
    nome: nome,
    texto: msg.value
  });
  msg.value = "";
}
