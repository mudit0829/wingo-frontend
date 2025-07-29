const API_BASE = "https://wingo-backend-nqk5.onrender.com";
const demoUser = "demo_user";

function placeBet(type, value) {
  const amount = parseFloat(document.getElementById("betAmount").value);
  if (!amount || amount < 1) {
    alert("Please enter a valid bet amount");
    return;
  }

  const payload = {
    username: demoUser,
    roundId: "demo", // use real roundId if available
    betType: type,
    betValue: value,
    amount
  };

  fetch(`${API_BASE}/api/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      alert(`Bet placed on ${value} (${type})`);
      fetchUserHistory();
    })
    .catch(err => console.error("Bet error", err));
}

function fetchUserHistory() {
  fetch(`${API_BASE}/api/bets/user/${demoUser}`)
    .then(res => res.json())
    .then(bets => {
      const historyDiv = document.getElementById("myHistory");
      if (!Array.isArray(bets)) return historyDiv.innerHTML = "No history.";
      historyDiv.innerHTML = bets
        .slice(-10)
        .reverse()
        .map(b => `<div>${b.betType} on ${b.betValue} – ₹${b.amount}</div>`)
        .join("");
    })
    .catch(err => console.error("History error", err));
}

function fetchRecentResults() {
  fetch(`${API_BASE}/api/rounds`)
    .then(res => res.json())
    .then(rounds => {
      const resultDiv = document.getElementById("recentResults");
      if (!Array.isArray(rounds)) return;
      resultDiv.innerHTML = rounds
        .slice(-5)
        .reverse()
        .map(r => `<div>Round ${r.roundId}: ${r.result}</div>`)
        .join("");
    })
    .catch(err => console.error("Results error", err));
}

function renderNumberButtons() {
  const numberDiv = document.getElementById("number-buttons");
  numberDiv.innerHTML = '';
  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.onclick = () => placeBet('number', i.toString());
    numberDiv.appendChild(btn);
  }
}

window.onload = () => {
  renderNumberButtons();
  fetchRecentResults();
  fetchUserHistory();
};
