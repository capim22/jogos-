import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

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

const urlParams = new URLSearchParams(window.location.search);
const sala = urlParams.get("sala");
const nome = urlParams.get("nome");

document.getElementById("titulo").innerText = `Sala ${sala} - Jogador: ${nome}`;

const tabuleiroRef = ref(db, `salas/${sala}/tabuleiro`);
const chatRef = ref(db, `salas/${sala}/chat`);

let simbolo = "X";

function desenharTabuleiro(tabuleiro) {
  const tabela = document.getElementById("tabuleiro");
  tabela.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const linha = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const celula = document.createElement("td");
      celula.innerText = tabuleiro[i][j] || "";
      celula.onclick = () => {
        if (!tabuleiro[i][j]) {
          tabuleiro[i][j] = simbolo;
          set(tabuleiroRef, tabuleiro);
          simbolo = simbolo === "X" ? "O" : "X";
        }
      };
      linha.appendChild(celula);
    }
    tabela.appendChild(linha);
  }
}

onValue(tabuleiroRef, (snapshot) => {
  const tabuleiro = snapshot.val() || [["", "", ""], ["", "", ""], ["", "", ""]];
  desenharTabuleiro(tabuleiro);
});

onValue(chatRef, (snapshot) => {
  const div = document.getElementById("chat");
  div.innerHTML = "";
  const mensagens = snapshot.val();
  for (let key in mensagens) {
    const p = document.createElement("p");
    p.innerText = mensagens[key];
    div.appendChild(p);
  }
});

window.enviarMensagem = function () {
  const msg = document.getElementById("mensagem").value;
  if (msg.trim()) {
    push(chatRef, `${nome}: ${msg}`);
    document.getElementById("mensagem").value = "";
  }
};
