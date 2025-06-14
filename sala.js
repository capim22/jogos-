import { db } from "./firebase-config.js";
import { ref, set, push, onChildAdded, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const url = new URL(window.location.href);
const sala = url.searchParams.get("sala");
const nome = url.searchParams.get("nome") || "Anônimo";
document.getElementById("sala-titulo").textContent = `Sala ${sala} - Jogador: ${nome}`;

const jogoEl = document.getElementById("jogo");
let turno = "X";
let tabuleiro = Array(9).fill("");

const chatRef = ref(db, "salas/" + sala + "/chat");
const jogoRef = ref(db, "salas/" + sala + "/jogo");

function renderizarTabuleiro() {
  jogoEl.innerHTML = "";
  tabuleiro.forEach((val, i) => {
    const btn = document.createElement("button");
    btn.textContent = val;
    btn.onclick = () => jogar(i);
    btn.className = "casa";
    jogoEl.appendChild(btn);
  });
}

function jogar(pos) {
  if (tabuleiro[pos] !== "") return;
  tabuleiro[pos] = turno;
  turno = turno === "X" ? "O" : "X";
  set(jogoRef, tabuleiro);
  verificarVitoria();
}

function verificarVitoria() {
  const ganhadores = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let comb of ganhadores) {
    const [a,b,c] = comb;
    if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
      alert(`Vitória de ${tabuleiro[a]}!`);
      tabuleiro = Array(9).fill("");
      set(jogoRef, tabuleiro);
      return;
    }
  }
}

onValue(jogoRef, (snap) => {
  if (snap.exists()) {
    tabuleiro = snap.val();
    renderizarTabuleiro();
  }
});

renderizarTabuleiro();

const mensagensEl = document.getElementById("mensagens");

function enviarMensagem() {
  const input = document.getElementById("mensagem");
  const msg = input.value.trim();
  if (msg) {
    push(chatRef, { nome, msg });
    input.value = "";
  }
}

onChildAdded(chatRef, (snap) => {
  const { nome, msg } = snap.val();
  const div = document.createElement("div");
  div.textContent = `${nome}: ${msg}`;
  mensagensEl.appendChild(div);
});
