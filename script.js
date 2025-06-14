if (location.pathname.endsWith("index.html") || location.pathname === "/jogos/") {
  const div = document.getElementById("salas");
  for (let i=1;i<=20;i++){
    const btn = document.createElement("button");
    btn.innerText = `Sala ${i}`;
    btn.classList.add("sala");
    btn.onclick = ()=> {
      const nome = prompt("Seu nome:");
      if (!nome) return;
      location.href = `sala.html?num=${i}&nome=${encodeURIComponent(nome)}`;
    };
    div.append(btn);
  }
}
else {
  const params = new URLSearchParams(location.search);
  const sala = params.get("num");
  const nome = params.get("nome");
  document.getElementById("tituloSala").innerText = `Sala ${sala} - Jogador: ${nome}`;

  const tabuleiro = document.getElementById("tabuleiro");
  let turno = "X", fim = false;

  const dbRef = db.ref(`salas/${sala}`);
  dbRef.child("jogo").on("value", snap=>{
    const tab = snap.val() || Array(9).fill("");
    tabuleiro.innerHTML = "";
    tab.forEach((v,i) => {
      const cel = document.createElement("div");
      cel.innerText = v;
      cel.onclick = ()=> {
        if (fim || v || turno !== nome[0]) return;
        tab[i] = turno;
        dbRef.child("jogo").set(tab);
        checaFim(tab);
        turno = turno==="X"?"O":"X";
      };
      tabuleiro.append(cel);
    });
  });

  function checaFim(t) {
    const win = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of win) {
      if (t[a] && t[a] === t[b] && t[a] === t[c]) {
        fim = true;
        alert(`Jogador ${t[a]} venceu!`);
        break;
      }
    }
    if (!fim && t.every(v=>v)) {
      fim = true;
      alert("Empate!");
    }
  }

  const msgs = document.getElementById("msgs");
  const inpt = document.getElementById("msgIn");
  document.getElementById("sendMsg").onclick = ()=>{
    const txt = inpt.value.trim(); if (!txt) return;
    dbRef.child("chat").push({nome, txt});
    inpt.value = "";
  };
  dbRef.child("chat").on("child_added", snap=>{
    const m = snap.val();
    msgs.innerHTML += `<div><strong>${m.nome}:</strong> ${m.txt}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  });
}