
let nome = "";
let salaAtual = "";
let jogador = "X";
let tabuleiro = ["", "", "", "", "", "", "", "", ""];
let ocupacaoSalas = {};

function entrar() {
  const nomeInput = document.getElementById("username");
  nome = nomeInput.value.trim();
  if (!nome) return alert("Digite seu nome");

  document.getElementById("login").style.display = "none";
  document.getElementById("salas").style.display = "block";
  gerarSalas();
}

function gerarSalas() {
  const lista = document.getElementById("lista-salas");
  lista.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    const div = document.createElement("div");
    div.className = "sala" + (ocupacaoSalas[i] >= 2 ? " ocupada" : "");
    div.innerText = "Sala " + i;
    div.onclick = () => entrarSala(i);
    lista.appendChild(div);
  }
}

function entrarSala(num) {
  salaAtual = "Sala " + num;
  ocupacaoSalas[num] = (ocupacaoSalas[num] || 0) + 1;

  document.getElementById("salas").style.display = "none";
  document.getElementById("jogo-chat").style.display = "block";
  document.getElementById("sala-atual").innerText = salaAtual;

  desenharTabuleiro();
}

function desenharTabuleiro() {
  const tab = document.getElementById("tabuleiro");
  tab.innerHTML = "";
  tabuleiro.forEach((val, i) => {
    const cel = document.createElement("div");
    cel.className = "celula";
    cel.innerText = val;
    cel.onclick = () => jogar(i);
    tab.appendChild(cel);
  });
}

function jogar(pos) {
  if (tabuleiro[pos]) return;
  tabuleiro[pos] = jogador;
  desenharTabuleiro();
  jogador = jogador === "X" ? "O" : "X";
}

function enviarMensagem() {
  const input = document.getElementById("mensagem");
  const msg = input.value.trim();
  if (!msg) return;
  const box = document.getElementById("mensagens");
  box.innerHTML += `<div><b>${nome}:</b> ${msg}</div>`;
  input.value = "";
  box.scrollTop = box.scrollHeight;
}
