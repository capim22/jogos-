import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const salaLista = document.getElementById("sala-lista");

for (let i = 1; i <= 20; i++) {
  const btn = document.createElement("button");
  btn.textContent = "Sala " + i;
  btn.onclick = () => {
    const nome = prompt("Digite seu nome:");
    if (nome) {
      window.location.href = `sala.html?sala=${i}&nome=${encodeURIComponent(nome)}`;
    }
  };
  salaLista.appendChild(btn);
}
