const API_BASE = "https://wingo-backend-nqk5.onrender.com";
let currentUser = null;
let authToken = null;

// Login and load user data
async function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      document.getElementById("login-section").style.display = "none";
      document.getElementById("game-section").style.display = "block";
      await loadUserWallet();
      await fetchCurrentRound();
      await fetchHistory();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
}

// Fetch wallet
async function loadUserWallet() {
  try {
    const res = await fetch(`${API_BASE}/api/users/${currentUser.username}/wallet`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await res.json();
    document.getElementById("wallet-balance").innerText = `₹${data.wallet}`;
  } catch (error) {
    console.error("Wallet error:", error);
  }
}

// Get current round
async function fetchCurrentRound() {
  try {
    const res = await fetch(`${API_BASE}/api/rounds/current`);
    const data = await res.json();

    document.getElementById("current-round").innerText = `Round ${data.roundId}`;
    document.getElementById("countdown").innerText = formatCountdown(data.remainingSeconds);
  } catch (err) {
    console.error("Round fetch error:", err);
  }
}

// Submit bet
async function placeBet(type) {
  const amount = parseFloat(document.getElementById("bet-amount").value);
  if (!amount || amount < 1) return alert("Enter valid amount");

  const betData = {
    username: currentUser.username,
    amount,
    roundId: document.getElementById("current-round").innerText.split(" ")[1],
  };

  if (["Red", "Green", "Violet"].includes(type)) {
    betData.color = type;
  } else {
    betData.number = parseInt(type);
  }

  try {
    const res = await fetch(`${API_BASE}/api/bets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(betData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Bet placed!");
      await loadUserWallet();
    } else {
      alert(data.message || "Bet failed");
    }
  } catch (error) {
    console.error("Bet error:", error);
  }
}

// Get recent round results
async function fetchHistory() {
  try {
    const res = await fetch(`${API_BASE}/api/rounds/history?limit=20`);
    const data = await res.json();

    const historyTable = document.getElementById("recent-history");
    historyTable.innerHTML = `
      <tr>
        <th>Round</th>
        <th>Number</th>
        <th>Color</th>
        <th>Time</th>
      </tr>
    `;

    data.forEach(round => {
      const color = getColorFromNumber(round.result);
      const row = `
        <tr>
          <td>${round.roundId}</td>
          <td>${round.result}</td>
          <td><span class="color-badge ${color.toLowerCase()}">${color}</span></td>
          <td>${new Date(round.timestamp).toLocaleTimeString()}</td>
        </tr>
      `;
      historyTable.innerHTML += row;
    });
  } catch (error) {
    console.error("History fetch error:", error);
  }
}

// Color logic
function getColorFromNumber(num) {
  if (num === 5 || num === 0) return "Violet";
  if ([1, 3, 7, 9].includes(num)) return "Green";
  if ([2, 4, 6, 8].includes(num)) return "Red";
  return "Unknown";
}

function formatCountdown(sec) {
  const min = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${min}:${s}`;
}

document.getElementById("login-button").addEventListener("click", loginUser);
