const sala = new URLSearchParams(window.location.search).get("sala") || "1";
let jogador = localStorage.getItem("jogador_" + sala);
if (!jogador) {
    jogador = prompt("Digite seu nome:");
    localStorage.setItem("jogador_" + sala, jogador);
}
document.getElementById("sala-info").textContent = `Sala ${sala} - Jogador: ${jogador}`;

const board = document.getElementById("board");
const statusDiv = document.getElementById("status");
let gameState = JSON.parse(localStorage.getItem("jogo_" + sala)) || Array(9).fill("");
let currentPlayer = localStorage.getItem("turno_" + sala) || "X";
let gameEnded = false;

function renderBoard() {
    board.innerHTML = "";
    gameState.forEach((cell, i) => {
        const div = document.createElement("div");
        div.className = "cell";
        div.textContent = cell;
        div.addEventListener("click", () => makeMove(i));
        board.appendChild(div);
    });
}

function makeMove(i) {
    if (gameState[i] === "" && !gameEnded) {
        gameState[i] = currentPlayer;
        localStorage.setItem("jogo_" + sala, JSON.stringify(gameState));
        if (checkWinner(currentPlayer)) {
            statusDiv.textContent = `Vitória de ${jogador} (${currentPlayer})!`;
            gameEnded = true;
        } else if (!gameState.includes("")) {
            statusDiv.textContent = "Empate!";
            gameEnded = true;
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            localStorage.setItem("turno_" + sala, currentPlayer);
        }
        renderBoard();
    }
}

function checkWinner(p) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return winPatterns.some(pattern => 
        pattern.every(i => gameState[i] === p)
    );
}

window.addEventListener("storage", e => {
    if (e.key === "jogo_" + sala || e.key === "turno_" + sala) {
        gameState = JSON.parse(localStorage.getItem("jogo_" + sala)) || Array(9).fill("");
        currentPlayer = localStorage.getItem("turno_" + sala) || "X";
        renderBoard();
    }
});

renderBoard();

// Chat
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const messages = document.getElementById("messages");

chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const msg = chatInput.value;
    if (msg.trim()) {
        const dados = JSON.parse(localStorage.getItem("chat_" + sala)) || [];
        dados.push({ nome: jogador, msg });
        localStorage.setItem("chat_" + sala, JSON.stringify(dados));
        chatInput.value = "";
    }
});

function renderChat() {
    const dados = JSON.parse(localStorage.getItem("chat_" + sala)) || [];
    messages.innerHTML = "";
    dados.forEach(m => {
        const div = document.createElement("div");
        div.textContent = `${m.nome}: ${m.msg}`;
        messages.appendChild(div);
    });
    messages.scrollTop = messages.scrollHeight;
}

window.addEventListener("storage", e => {
    if (e.key === "chat_" + sala) renderChat();
});

renderChat();
