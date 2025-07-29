const API = "https://wingo-backend-nqk5.onrender.com";

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (!token || !username) {
  alert("Session expired. Please login again.");
  window.location.href = "login.html";
}

document.getElementById("username").textContent = username;

// Load number buttons
const numberContainer = document.getElementById("number-buttons");
for (let i = 0; i <= 9; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.onclick = () => placeBet(null, i);
  numberContainer.appendChild(btn);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

async function placeBet(color, number = null) {
  const amount = document.getElementById("amount").value;
  if (!amount || amount <= 0) return alert("Enter valid amount");

  const payload = {
    username,
    amount,
    color: color || null,
    number: number !== null ? number : null,
  };

  const res = await fetch(`${API}/api/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  alert(data.message || "Bet Placed!");
  loadWallet();
  loadMyBets();
}

async function loadWallet() {
  const res = await fetch(`${API}/api/users/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById("wallet").textContent = data.wallet.toFixed(2);
}

async function loadMyBets() {
  const res = await fetch(`${API}/api/bets/user/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const bets = await res.json();
  const container = document.getElementById("betHistory");
  container.innerHTML = "";
  if (Array.isArray(bets)) {
    bets.reverse().forEach(bet => {
      const li = document.createElement("li");
      li.textContent = `Round ${bet.roundId} - ${bet.color || bet.number} - ₹${bet.amount} - Result: ${bet.winAmount || 0}`;
      container.appendChild(li);
    });
  }
}

async function loadRecentResults() {
  const res = await fetch(`${API}/api/rounds`);
  const rounds = await res.json();
  const container = document.getElementById("recentResults");
  container.innerHTML = "";
  rounds.reverse().slice(0, 10).forEach(round => {
    const li = document.createElement("li");
    li.textContent = `Round ${round.roundId}: ${round.result}`;
    container.appendChild(li);
    document.getElementById("roundId").textContent = round.roundId;
  });
}

function updateTimer() {
  const now = new Date();
  const seconds = now.getSeconds();
  const countdown = 30 - (seconds % 30);
  document.getElementById("timer").textContent = countdown + "s";
}

setInterval(updateTimer, 1000);
setInterval(loadRecentResults, 5000);

loadWallet();
loadMyBets();
loadRecentResults();
updateTimer();
