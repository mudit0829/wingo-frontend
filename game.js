const backendUrl = 'https://wingo-backend-nqk5.onrender.com'; // Update if needed
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
    return;
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
    } else {
      document.getElementById("betMsg").textContent = "❌ " + (data.message || "Error placing bet.");
    }
  } catch (err) {
    console.error("Bet error:", err);
  }
}

async function fetchUserBets() {
  const username = localStorage.getItem("username");
  try {
    const res = await fetch(`${backendUrl}/api/bets/user/${username}`);
    const bets = await res.json();
    const tbody = document.getElementById("betHistory");
    tbody.innerHTML = "";
    bets.reverse().slice(0, 20).forEach(bet => {
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

function startTimer() {
  let timeLeft = 25;
  clearInterval(interval);
  interval = setInterval(() => {
    document.getElementById("timer").textContent = timeLeft + "s";
    if (timeLeft === 0) {
      clearInterval(interval);
      document.getElementById("timer").textContent = "Draw Time...";
      fetchLatestRound();
      setTimeout(startTimer, 5000); // Wait 5s before restarting
    }
    timeLeft--;
  }, 1000);
}

window.onload = () => {
  const token = localStorage.getItem("token");
  if (!token) return window.location.href = "login.html";

  fetchLatestRound();
  fetchUserBets();
  startTimer();
};
