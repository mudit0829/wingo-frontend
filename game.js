const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MjY0MTUyYTI1ZjQwNGI4YzU5N2QiLCJpYXQiOjE3NTM3NjczOTV9.9LOI9UD0Fjic6SmWREqe08A1gqImyO_nFwOLLpnxZIc";
const backendURL = "https://wingo-backend-nqk5.onrender.com";

let currentRoundId = null;
let walletBalance = 0;
let selectedBet = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchWallet();
  fetchCurrentRound();
  fetchHistory();
  setInterval(() => {
    fetchCurrentRound();
    fetchWallet();
    fetchHistory();
  }, 5000);
});

function fetchWallet() {
  fetch(`${backendURL}/api/users/wallet`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      walletBalance = data.wallet || 0;
      document.getElementById("wallet").innerText = `₹${walletBalance.toFixed(2)}`;
    });
}

function fetchCurrentRound() {
  fetch(`${backendURL}/api/rounds/current`)
    .then(res => res.json())
    .then(round => {
      currentRoundId = round.roundId;
      document.getElementById("round-id").innerText = round.roundId;
      document.getElementById("timer").innerText = `${round.secondsLeft}s`;
      document.getElementById("result").innerText = round.result || "--";
    });
}

function fetchHistory() {
  fetch(`${backendURL}/api/rounds`)
    .then(res => res.json())
    .then(rounds => {
      const latest = rounds.slice(0, 5);
      const html = latest.map(r => `<div>🕑 ${r.roundId} ➜ 🎯 ${r.result || "--"}</div>`).join("");
      document.getElementById("history").innerHTML = html;
    });
}

function showPopup(type, value) {
  selectedBet = { type, value };
  document.getElementById("popup-title").innerText = `Bet on ${type} - ${value}`;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popup").style.display = "block";
}

function hidePopup() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popup").style.display = "none";
}

function placeBet(amount) {
  const effectiveAmount = amount * 0.98;
  const body = {
    roundId: currentRoundId,
    amount: effectiveAmount,
    [selectedBet.type === "color" ? "color" : "number"]: selectedBet.value
  };

  fetch(`${backendURL}/api/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      alert("Bet placed!");
      hidePopup();
      fetchWallet();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to place bet");
    });
}
