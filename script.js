
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

const url = new URLSearchParams(window.location.search);
const sala = url.get("sala");
const nome = url.get("nome");
document.getElementById("info").innerText = `Sala ${sala} - Jogador: ${nome}`;

const tabuleiro = document.getElementById("tabuleiro");
let jogadorAtual = "X";

function desenharTabuleiro(estado) {
  tabuleiro.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const td = document.createElement("td");
      const valor = estado && estado[i] && estado[i][j] ? estado[i][j] : "";
      td.textContent = valor;
      td.onclick = () => jogar(i, j);
      tr.appendChild(td);
    }
    tabuleiro.appendChild(tr);
  }
}

function jogar(i, j) {
  const refTab = ref(db, "salas/" + sala + "/tabuleiro");
  onValue(refTab, snapshot => {
    const estado = snapshot.val() || [[], [], []];
    if (!estado[i]) estado[i] = [];
    if (!estado[i][j]) {
      estado[i][j] = jogadorAtual;
      set(refTab, estado);
      jogadorAtual = jogadorAtual === "X" ? "O" : "X";
    }
  }, { onlyOnce: true });
}

const refTab = ref(db, "salas/" + sala + "/tabuleiro");
onValue(refTab, snapshot => {
  desenharTabuleiro(snapshot.val());
});

const mensagens = document.getElementById("mensagens");
function enviar() {
  const msg = document.getElementById("msg").value;
  if (msg.trim() === "") return;
  push(ref(db, "salas/" + sala + "/chat"), `${nome}: ${msg}`);
  document.getElementById("msg").value = "";
}
onValue(ref(db, "salas/" + sala + "/chat"), snapshot => {
  mensagens.innerHTML = "";
  snapshot.forEach(child => {
    const p = document.createElement("p");
    p.textContent = child.val();
    mensagens.appendChild(p);
  });
});
