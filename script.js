// CONFIG FIREBASE (substitua pelos seus dados reais)
const firebaseConfig = {
    apiKey: "AIzaSyACUpW8INZOyd4A0AZ4Ndqv7uM3h0FZYK8",
    authDomain: "capim-jogo-da-velha.firebaseapp.com",
    databaseURL: "https://capim-jogo-da-velha-default-rtdb.firebaseio.com",
    projectId: "capim-jogo-da-velha",
    storageBucket: "capim-jogo-da-velha.appspot.com",
    messagingSenderId: "89311283108",
    appId: "1:89311283108:web:047749fd2c081f727a2331"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const url = new URLSearchParams(window.location.search);
const sala = url.get("sala");
const nome = url.get("nome");

document.getElementById("titulo").innerText = "Sala " + sala + " - Jogador: " + nome;

const tabuleiro = document.getElementById("tabuleiro");
const mensagens = document.getElementById("mensagens");
let jogadaAtual = "X";

function criarTabuleiro() {
    for (let i = 0; i < 3; i++) {
        const linha = tabuleiro.insertRow();
        for (let j = 0; j < 3; j++) {
            const celula = linha.insertCell();
            celula.onclick = () => jogar(i, j);
        }
    }
}

function jogar(i, j) {
    const celula = tabuleiro.rows[i].cells[j];
    if (celula.textContent !== "") return;
    celula.textContent = jogadaAtual;
    salvarJogada(i, j, jogadaAtual);
    verificarVitoria();
    jogadaAtual = jogadaAtual === "X" ? "O" : "X";
}

function salvarJogada(i, j, jogador) {
    db.ref("salas/" + sala + "/jogadas/" + i + "_" + j).set(jogador);
}

function carregarTabuleiro() {
    db.ref("salas/" + sala + "/jogadas").on("value", snapshot => {
        const jogadas = snapshot.val();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const celula = tabuleiro.rows[i].cells[j];
                const key = i + "_" + j;
                celula.textContent = jogadas && jogadas[key] ? jogadas[key] : "";
            }
        }
    });
}

function verificarVitoria() {
    const t = [...tabuleiro.rows].map(row => [...row.cells].map(c => c.textContent));
    const linhas = [
        [t[0][0], t[0][1], t[0][2]], [t[1][0], t[1][1], t[1][2]], [t[2][0], t[2][1], t[2][2]],
        [t[0][0], t[1][0], t[2][0]], [t[0][1], t[1][1], t[2][1]], [t[0][2], t[1][2], t[2][2]],
        [t[0][0], t[1][1], t[2][2]], [t[0][2], t[1][1], t[2][0]]
    ];
    for (const linha of linhas) {
        if (linha.every(v => v === "X") || linha.every(v => v === "O")) {
            alert("Vitória de " + linha[0]);
            db.ref("salas/" + sala + "/jogadas").remove(); // reseta
        }
    }
}

function enviarMensagem() {
    const texto = document.getElementById("msg").value;
    if (texto) {
        const ref = db.ref("salas/" + sala + "/chat").push();
        ref.set(nome + ": " + texto);
        document.getElementById("msg").value = "";
    }
}

function escutarChat() {
    db.ref("salas/" + sala + "/chat").on("child_added", snap => {
        const p = document.createElement("p");
        p.innerText = snap.val();
        mensagens.appendChild(p);
        mensagens.scrollTop = mensagens.scrollHeight;
    });
}

criarTabuleiro();
carregarTabuleiro();
escutarChat();
