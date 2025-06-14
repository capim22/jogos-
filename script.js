
const urlParams = new URLSearchParams(window.location.search);
const sala = urlParams.get('sala');
let jogador = localStorage.getItem("jogador_" + sala);

if (!jogador) {
    jogador = prompt("Digite seu nome:");
    localStorage.setItem("jogador_" + sala, jogador);
}

document.getElementById("salaTitulo").innerText = "Sala " + sala + " - Jogador: " + jogador;

const tabuleiro = document.getElementById("tabuleiro");
const mensagens = document.getElementById("mensagens");
const entrada = document.getElementById("entrada");

let simbolo = localStorage.getItem("simbolo_" + sala);
if (!simbolo) {
    simbolo = "X";
    localStorage.setItem("simbolo_" + sala, simbolo);
} else {
    simbolo = simbolo === "X" ? "O" : "X";
    localStorage.setItem("simbolo_" + sala, simbolo);
}

let jogo = ["", "", "", "", "", "", "", "", ""];
let fim = false;

function verificarVencedor() {
    const combinacoes = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (let c of combinacoes) {
        if (jogo[c[0]] && jogo[c[0]] === jogo[c[1]] && jogo[c[1]] === jogo[c[2]]) {
            return jogo[c[0]];
        }
    }
    if (!jogo.includes("")) return "Empate";
    return null;
}

function jogar(i) {
    if (fim || jogo[i]) return;
    jogo[i] = simbolo;
    renderizar();
    const vencedor = verificarVencedor();
    if (vencedor) {
        fim = true;
        document.getElementById("mensagemVitoria").innerText = vencedor === "Empate" ? "Empate!" : `Vitória de ${jogador} (${simbolo})!`;
    }
}

function renderizar() {
    tabuleiro.innerHTML = "";
    jogo.forEach((v, i) => {
        const cel = document.createElement("div");
        cel.className = "celula";
        cel.innerText = v;
        cel.onclick = () => jogar(i);
        tabuleiro.appendChild(cel);
    });
}

function enviarMensagem() {
    const msg = entrada.value.trim();
    if (msg) {
        const linha = document.createElement("div");
        linha.innerText = jogador + ": " + msg;
        mensagens.appendChild(linha);
        entrada.value = "";
    }
}

renderizar();
