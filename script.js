
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    const pos = cell.getAttribute('data-pos');
    if (board[pos] === "") {
      board[pos] = currentPlayer;
      cell.textContent = currentPlayer;
      if (checkWinner()) {
        alert(`${currentPlayer} venceu!`);
        resetBoard();
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
      }
    }
  });
});

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => 
    board[combo[0]] === currentPlayer &&
    board[combo[1]] === currentPlayer &&
    board[combo[2]] === currentPlayer
  );
}

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  document.querySelectorAll('.cell').forEach(cell => cell.textContent = "");
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const box = document.getElementById('chat-box');
  if (input.value.trim() !== "") {
    const p = document.createElement('p');
    p.textContent = `Você: ${input.value}`;
    box.appendChild(p);
    box.scrollTop = box.scrollHeight;
    input.value = "";
  }
}
