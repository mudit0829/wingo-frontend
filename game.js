const API_BASE = "https://wingo-backend-nqk5.onrender.com";
const token = "guest";  // no auth
const username = "demo_user";  // fake user

async function fetchWallet() {
  document.getElementById("wallet-balance").innerText = "5000 (demo)";
}

async function fetchTimerAndRound() {
  try {
    const res = await fetch(`${API_BASE}/api/rounds/latest`);
    const round = await res.json();
    document.getElementById("round-id").innerText = round.roundId || "N/A";

    const timeLeft = 30 - Math.floor((Date.now() - new Date(round.timestamp)) / 1000 % 30);
    document.getElementById("timer").innerText = timeLeft;
  } catch {
    document.getElementById("round-id").innerText = "Error";
  }
}

async function placeBet(betType) {
  const amount = document.getElementById("bet-amount").value;
  if (!amount || amount <= 0) return alert("Enter valid bet amount");

  try {
    const res = await fetch(`${API_BASE}/api/rounds/latest`);
    const round = await res.json();
    const body = {
      username,
      roundId: round.roundId,
      amount,
      ...(typeof betType === "number" ? { number: betType } : { color: betType })
    };

    await fetch(`${API_BASE}/api/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // no Authorization
      body: JSON.stringify(body),
    });

    alert(`Bet placed on ${betType}`);
    fetchUserBets();
    fetchWallet();
  } catch (err) {
    alert("Bet error");
    console.error(err);
  }
}

async function fetchUserBets() {
  try {
    const res = await fetch(`${API_BASE}/api/bets/user/${username}`);
    const bets = await res.json();

    const tbody = document.querySelector("#history-table tbody");
    tbody.innerHTML = "";
    (bets.reverse() || []).forEach(bet => {
      const row = `<tr>
        <td>${bet.roundId}</td>
        <td>${bet.color || "-"}</td>
        <td>${bet.number ?? "-"}</td>
        <td>₹${bet.amount}</td>
        <td>${bet.status || "Pending"}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Bet fetch error:", err);
    document.querySelector("#history-table tbody").innerHTML =
      `<tr><td colspan="5">Demo: No bets loaded</td></tr>`;
  }
}

async function fetchRecentResults() {
  try {
    const res = await fetch(`${API_BASE}/api/rounds`);
    const rounds = await res.json();
    const latest = rounds.slice(-10).reverse();

    document.getElementById("recent-results").innerHTML = latest.map(r =>
      `<span class="result result-${r.resultColor?.toLowerCase()}">${r.result}</span>`
    ).join(" ");
  } catch {
    document.getElementById("recent-results").innerText = "Error loading results";
  }
}

function logout() {
  alert("Logout disabled in demo.");
}

window.onload = () => {
  fetchWallet();
  fetchTimerAndRound();
  fetchUserBets();
  fetchRecentResults();
  setInterval(fetchTimerAndRound, 1000);
};
