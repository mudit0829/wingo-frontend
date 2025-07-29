// game.js

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MjY0MTUyYTI1ZjQwNGI4YzU5N2QiLCJpYXQiOjE3NTM3NjczOTV9.9LOI9UD0Fjic6SmWREqe08A1gqImyO_nFwOLLpnxZIc";
const apiBase = "https://wingo-backend-nqk5.onrender.com/api";
let currentRound = null;

// Fetch wallet
async function fetchWallet() {
  const res = await fetch(`${apiBase}/users/wallet`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById("wallet").innerText = `Wallet: ₹${data.wallet}`;
}

// Fetch current round
async function fetchCurrentRound() {
  const res = await fetch(`${apiBase}/rounds/current`);
  const round = await res.json();
  currentRound = round;
  startTimer(new Date(round.timestamp));
}

// Start timer till round ends (30 sec cycle)
function startTimer(startTime) {
  const interval = setInterval(() => {
    const now = new Date();
    const diff = 30 - Math.floor((now - new Date(startTime)) / 1000);
    if (diff <= 0) {
      clearInterval(interval);
      document.getElementById("timer").innerText = "Waiting for result...";
      setTimeout(() => {
        fetchResult();
        fetchWallet();
        fetchCurrentRound();
      }, 5000); // Wait for draw
    } else {
      document.getElementById("timer").innerText = `Next result in ${diff}s`;
    }
  }, 1000);
}

// Place bet
async function placeBet(type, value) {
  const amount = prompt(`Enter amount for ${type.toUpperCase()} ${value}`);
  if (!amount || isNaN(amount)) return;

  const res = await fetch(`${apiBase}/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      roundId: currentRound.roundId,
      timestamp: currentRound.timestamp,
      color: type === "color" ? value : null,
      number: type === "number" ? value : null,
      amount
    })
  });

  const data = await res.json();
  alert(data.message || "Bet placed");
  fetchWallet();
}

// Get latest result
async function fetchResult() {
  const res = await fetch(`${apiBase}/rounds/history`);
  const rounds = await res.json();
  if (rounds.length > 0) {
    const r = rounds[0];
    document.getElementById("result").innerText =
      `Result: ${r.resultNumber} (${r.resultColor})`;
  }
}

// Load UI
window.onload = () => {
  fetchWallet();
  fetchCurrentRound();
  fetchResult();

  // Add event listeners
  document.querySelectorAll(".color-btn").forEach(btn => {
    btn.onclick = () => placeBet("color", btn.dataset.color);
  });
  document.querySelectorAll(".number-btn").forEach(btn => {
    btn.onclick = () => placeBet("number", btn.dataset.number);
  });
};
