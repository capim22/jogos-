
const urlParams = new URLSearchParams(window.location.search);
const sala = urlParams.get('sala');
const nome = urlParams.get('nome') || prompt("Digite seu nome:");
document.getElementById('salaInfo').innerText = `Sala ${sala} - Jogador: ${nome}`;

const db = firebase.database();
const salaRef = db.ref("salas/" + sala);
const chatRef = db.ref("chat/" + sala);

const tabuleiro = document.getElementById("tabuleiro");
let simbolo = "X";

for (let i = 0; i < 3; i++) {
    const linha = tabuleiro.insertRow();
    for (let j = 0; j < 3; j++) {
        const celula = linha.insertCell();
        celula.addEventListener("click", () => jogar(i, j));
    }
}

function jogar(i, j) {
    salaRef.child(`${i}${j}`).set(simbolo);
    simbolo = simbolo === "X" ? "O" : "X";
}

salaRef.on("value", snapshot => {
    const dados = snapshot.val() || {};
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const valor = dados[`${i}${j}`] || "";
            tabuleiro.rows[i].cells[j].innerText = valor;
        }
    }
});

function enviarMensagem() {
    const texto = document.getElementById("mensagem").value;
    if (texto.trim() !== "") {
        chatRef.push(`${nome}: ${texto}`);
        document.getElementById("mensagem").value = "";
    }
}

chatRef.on("child_added", snapshot => {
    const msg = snapshot.val();
    const div = document.getElementById("mensagens");
    div.innerHTML += msg + "<br>";
});
