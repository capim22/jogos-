import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyACUpW8INZOyd4A0AZ4Ndqv7uM3h0FZYK8",
  authDomain: "capim-jogo-da-velha.firebaseapp.com",
  databaseURL: "https://capim-jogo-da-velha-default-rtdb.firebaseio.com",
  projectId: "capim-jogo-da-velha",
  storageBucket: "capim-jogo-da-velha.appspot.com",
  messagingSenderId: "89311283108",
  appId: "1:89311283108:web:047749fd2c081f727a2331"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Obtem parâmetros da URL
const params = new URLSearchParams(window.location.search);
const sala = params.get("sala");
const nome = params.get("nome");
document.getElementById("titulo").innerText = `Sala ${sala} - Jogador: ${nome}`;

const tabuleiroEl = document.getElementById("tabuleiro");
const msgEl = document.getElementById("mensagem");
const mensagensEl = document.getElementById("mensagens");
const msgInput = document.getElementById("msg");

let tabuleiro = ["", "", "", "", "", "", "", "", ""];
let vez = "X";
let venceu = false;

// Cria casas do tabuleiro
for (let i = 0; i < 9; i++) {
  const casa = document.createElement("div");
  casa.className = "casa";
  casa.dataset.index = i;
  casa.onclick = () => jogar(i);
  tabuleiroEl.appendChild(casa);
}

function jogar(i) {
  if (tabuleiro[i] || venceu) return;
  tabuleiro[i] = vez;
  vez = vez === "X" ? "O" : "X";
  atualizarTabuleiro();
  salvarJogo();
  verificarVitoria();
}

function atualizarTabuleiro() {
  const casas = document.querySelectorAll(".casa");
  tabuleiro.forEach((val, i) => casas[i].innerText = val);
}

function verificarVitoria() {
  const v = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of v) {
    if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
      msgEl.innerText = `Vitória de ${tabuleiro[a]}!`;
      venceu = true;
    }
  }
}

// Firebase jogo + chat
const jogoRef = ref(db, `salas/${sala}/jogo`);
const chatRef = ref(db, `salas/${sala}/chat`);

function salvarJogo() {
  set(jogoRef, tabuleiro);
}

onValue(jogoRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    tabuleiro = data;
    atualizarTabuleiro();
    verificarVitoria();
  }
});

function enviarMensagem() {
  const texto = msgInput.value.trim();
  if (!texto) return;
  push(chatRef, { nome, texto });
  msgInput.value = "";
}

onValue(chatRef, (snapshot) => {
  mensagensEl.innerHTML = "";
  snapshot.forEach(child => {
    const { nome, texto } = child.val();
    const div = document.createElement("div");
    div.innerText = `${nome}: ${texto}`;
    mensagensEl.appendChild(div);
  });
});
