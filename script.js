const salas = {};
for (let i = 1; i <= 20; i++) {
  salas['Sala ' + i] = { tabuleiro: Array(9).fill(""), turno: "X", chat: [] };
}

const listaSalas = document.getElementById("lista-salas");
const boardEl = document.getElementById("board");
const chatBox = document.getElementById("chat-box");
let salaAtual = "";
let jogador = "X";

for (let nome in salas) {
  const li = document.createElement("li");
  li.textContent = nome;
  li.onclick = () => entrarSala(nome);
  listaSalas.appendChild(li);
}

function entrarSala(nome) {
  salaAtual = nome;
  document.getElementById("salas").style.display = "none";
  document.getElementById("jogo").style.display = "block";
  document.getElementById("sala-atual").textContent = nome;
  renderBoard();
  renderChat();
}

function sairSala() {
  salaAtual = "";
  document.getElementById("salas").style.display = "block";
  document.getElementById("jogo").style.display = "none";
}

function renderBoard() {
  boardEl.innerHTML = "";
  salas[salaAtual].tabuleiro.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.addEventListener("click", () => jogar(i));
    boardEl.appendChild(div);
  });
}

function jogar(index) {
  const sala = salas[salaAtual];
  if (sala.tabuleiro[index] === "") {
    sala.tabuleiro[index] = sala.turno;
    sala.turno = sala.turno === "X" ? "O" : "X";
    renderBoard();
    checarVitoria();
  }
}

function checarVitoria() {
  const t = salas[salaAtual].tabuleiro;
  const c = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let [a,b,c1] of c) {
    if (t[a] && t[a] === t[b] && t[b] === t[c1]) {
      alert("Jogador " + t[a] + " venceu!");
      salas[salaAtual].tabuleiro = Array(9).fill("");
      renderBoard();
      break;
    }
  }
}

function renderChat() {
  chatBox.innerHTML = "";
  salas[salaAtual].chat.forEach(m => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${m.autor}:</strong> ${m.texto}`;
    chatBox.appendChild(p);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function enviarMensagem() {
  const input = document.getElementById("chat-input");
  if (input.value.trim() !== "") {
    salas[salaAtual].chat.push({ autor: "Você", texto: input.value });
    input.value = "";
    renderChat();
  }
}