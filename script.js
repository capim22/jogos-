const urlParams = new URLSearchParams(window.location.search);
const sala = urlParams.get("sala");
const nome = urlParams.get("nome");

document.getElementById("titulo").innerText = `Sala ${sala} - Jogador: ${nome}`;

const tabuleiro = document.getElementById("tabuleiro");
let jogador = "X";

for (let i = 0; i < 3; i++) {
  const linha = tabuleiro.insertRow();
  for (let j = 0; j < 3; j++) {
    const celula = linha.insertCell();
    celula.onclick = () => {
      if (celula.innerText === "") {
        celula.innerText = jogador;
        jogador = jogador === "X" ? "O" : "X";
      }
    };
  }
}

function enviarMensagem() {
  const input = document.getElementById("mensagem");
  const mensagens = document.getElementById("mensagens");
  if (input.value.trim() !== "") {
    const msg = document.createElement("p");
    msg.innerText = `${nome}: ${input.value}`;
    mensagens.appendChild(msg);
    input.value = "";
  }
}
