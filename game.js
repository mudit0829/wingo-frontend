const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MjY0MTUyYTI1ZjQwNGI4YzU5N2QiLCJpYXQiOjE3NTM3ODA0NTd9.TZfHqzweHCK42Dii3gHFwn7FoQf0sIqRJjpMm-3SdbA";

let selectedBet = '';
let baseAmount = 0;
let multiplier = 1;

async function fetchWallet() {
  const res = await fetch("https://wingo-backend-nqk5.onrender.com/api/users/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById("wallet").innerText = data.wallet.toFixed(2);
}

async function fetchRound() {
  const res = await fetch("https://wingo-backend-nqk5.onrender.com/api/rounds/current");
  const data = await res.json();
  document.getElementById("roundId").innerText = data.roundId || '--';
}

async function fetchHistory() {
  const history = [
    { round: "20250729100051174", number: 5, color: "Green" },
    { round: "20250729100051173", number: 7, color: "Red" }
  ];
  const list = document.getElementById("historyList");
  list.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.round} - ${item.number} - ${item.color}`;
    list.appendChild(li);
  });
}

function openBetPopup(bet) {
  selectedBet = bet;
  baseAmount = 0;
  multiplier = 1;
  document.getElementById("popup").style.display = "flex";
  document.getElementById("betTypeLabel").innerText = `Your Bet: ${bet}`;
  updateTotal();
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function setAmount(amount) {
  baseAmount = amount;
  updateTotal();
}

function setMultiplier(multi) {
  multiplier = multi;
  updateTotal();
}

function updateTotal() {
  document.getElementById("totalAmount").innerText = (baseAmount * multiplier).toFixed(2);
}

async function submitBet() {
  const total = baseAmount * multiplier;
  const roundId = document.getElementById("roundId").innerText;

  const res = await fetch("https://wingo-backend-nqk5.onrender.com/api/bets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      roundId: roundId,
      choice: selectedBet,
      amount: total
    })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Bet Placed!");
    fetchWallet();
    closePopup();
  } else {
    alert("Error placing bet: " + data.message);
  }
}

function showSection(id) {
  document.querySelectorAll(".info-section").forEach(div => {
    div.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

window.onload = () => {
  fetchWallet();
  fetchRound();
  fetchHistory();
};
