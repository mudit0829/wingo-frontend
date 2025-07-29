const backendUrl = 'https://wingo-backend-nqk5.onrender.com';
let roundId = null;
let interval;

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

async function fetchLatestRound() {
  try {
    const res = await fetch(`${backendUrl}/api/rounds`);
    const rounds = await res.json();
    const latest = rounds[rounds.length - 1];
    roundId = latest.roundId;
    document.getElementById("currentRoundId").textContent = latest.roundId;
    document.getElementById("currentResult").textContent = latest.result ?? "Waiting...";
    document.getElementById("currentColor").textContent = latest.color ?? "--";
  } catch (err) {
    console.error("Error fetching round:", err);
  }
}

async function placeBet() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const amount = parseFloat(document.getElementById("betAmount").value);
  const colorBet = document.getElementById("colorBet").value;
  const numberBet = document.getElementById("numberBet").value;

  if (!token || !username) {
    alert("Please login again.");
    return window.location.href = "login.html";
  }

  if (!amount || amount < 1) {
    alert("Enter a valid bet amount.");
    return;
  }

  try {
    const res = await fetch(`${backendUrl}/api/bets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username,
        amount,
        colorBet: colorBet || null,
        numberBet: numberBet || null,
        roundId
      })
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById("betMsg").textContent = "✅ Bet placed successfully!";
      fetchUserBets();
      fetchWalletBalance();
    } else {
      document.getElementById("betMsg").textContent = "❌ " + (data.message || "Error placing bet.");
    }
  } catch (err) {
    console.error("Bet error:", err);
  }
}

async function fetchUserBets() {
  const username = localStorage.getItem("username");
  if (!username) return;

  try {
    const res = await fetch(`${backendUrl}/api/bets/user/${username}`);
    const data = await res.json();
    const tbody = document.getElementById("betHistory");
    tbody.innerHTML = "";

    if (!Array.isArray(data)) {
      console.warn("Expected array, got:", data);
      return;
    }

    data.reverse().slice(0, 20).forEach(bet => {
      const row = `<tr>
        <td>${bet.roundId}</td>
        <td>${bet.colorBet || "-"}</td>
        <td>${bet.numberBet || "-"}</td>
        <td>₹${bet.amount}</td>
        <td>${new Date(bet.timestamp).toLocaleTimeString()}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Bet fetch error:", err);
  }
}

async function fetchWalletBalance() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return;

  try {
    const res = await fetch(`${backendUrl}/api/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const user = await res.json();
    if (res.ok && user.wallet !== undefined) {
      document.getElementById("wallet").textContent = `💰 Wallet: ₹${user.wallet.toFixed(2)}`;
    }
  } catch (err) {
    console.error("Wallet fetch error:", err);
  }
}

function startTimer() {
  let timeLeft = 25;
  clearInterval(interval);
  interval = setInterval(() => {
    document.getElementById("timer").textContent = timeLeft + "s";
    if (timeLeft === 0) {
      clearInterval(interval);
      document.getElementById("timer").textContent = "Draw Time...";
      fetchLatestRound();
      setTimeout(startTimer, 5000); // Restart after 5s
    }
    timeLeft--;
  }, 1000);
}

window.onload = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    return window.location.href = "login.html";
  }

  fetchWalletBalance();
  fetchLatestRound();
  fetchUserBets();
  startTimer();
};
