const API = "https://wingo-backend-nqk5.onrender.com";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MjY0MTUyYTI1ZjQwNGI4YzU5N2QiLCJpYXQiOjE3NTM3NjczOTV9.9LOI9UD0Fjic6SmWREqe08A1gqImyO_nFwOLLpnxZIc";

let currentRound = null;

async function fetchWallet() {
  const res = await fetch(`${API}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  document.getElementById("wallet").textContent = data.wallet.toFixed(2);
}

async function fetchRound() {
  const res = await fetch(`${API}/api/rounds`);
  const rounds = await res.json();
  currentRound = rounds[rounds.length - 1];
  document.getElementById("roundId").textContent = currentRound.roundId;
}

async function fetchResults() {
  const res = await fetch(`${API}/api/rounds`);
  const rounds = await res.json();
  const recent = rounds.slice(-10).reverse();
  const resultBox = document.getElementById("results");
  resultBox.innerHTML = recent.map(r => `
    <div class="result-box">
      <strong>${r.roundId}</strong>: ${r.result || "Pending"}
    </div>
  `).join("");
}

async function fetchHistory() {
  const res = await fetch(`${API}/api/bets/user/test2@example.com`);
  const bets = await res.json();
  const tbody = document.getElementById("historyBody");
  tbody.innerHTML = bets.reverse().slice(0, 10).map(b => `
    <tr>
      <td>${b.roundId}</td>
      <td>${b.colorBet || '-'}</td>
      <td>${b.numberBet || '-'}</td>
      <td>₹${b.betAmount}</td>
      <td>${b.winAmount ? `₹${b.winAmount}` : '-'}</td>
    </tr>
  `).join("");
}

async function placeBet(color) {
  const betAmount = document.getElementById("betAmount").value;
  if (!betAmount || betAmount <= 0) return alert("Enter valid amount");

  await fetch(`${API}/api/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      roundId: currentRound.roundId,
      betAmount,
      colorBet: color
    }),
  });

  alert(`Color bet on ${color} placed!`);
  fetchWallet();
  fetchHistory();
}

async function placeNumberBet() {
  const betAmount = document.getElementById("betAmount").value;
  const number = document.getElementById("numberBet").value;
  if (!betAmount || betAmount <= 0 || number === "") return alert("Invalid input");

  await fetch(`${API}/api/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      roundId: currentRound.roundId,
      betAmount,
      numberBet: number
    }),
  });

  alert(`Number bet on ${number} placed!`);
  fetchWallet();
  fetchHistory();
}

function startTimer() {
  let time = 25;
  const timerElem = document.getElementById("timer");
  timerElem.textContent = time;

  const interval = setInterval(() => {
    time--;
    timerElem.textContent = time;
    if (time <= 0) {
      clearInterval(interval);
      timerElem.textContent = "Draw...";

      setTimeout(() => {
        loadAll();
        startTimer();
      }, 5000);
    }
  }, 1000);
}

function loadAll() {
  fetchWallet();
  fetchRound();
  fetchResults();
  fetchHistory();
}

loadAll();
startTimer();
