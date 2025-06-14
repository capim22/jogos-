const sala = new URLSearchParams(window.location.search).get('sala');
const jogador = prompt("Digite seu nome:");
document.getElementById("titulo").innerText = `Sala ${sala} - Jogador: ${jogador}`;
let vez = "X";
document.querySelectorAll(".celula").forEach(c => {
  c.onclick = () => {
    if (!c.textContent) {
      c.textContent = vez;
      vez = vez === "X" ? "O" : "X";
    }
  };
});
function enviar() {
  const msg = document.getElementById("mensagem");
  const div = document.createElement("div");
  div.textContent = `${jogador}: ${msg.value}`;
  document.getElementById("mensagens").appendChild(div);
  msg.value = "";
}
