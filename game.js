const API_BASE = "https://wingo-backend-nqk5.onrender.com/api";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MjY0MTUyYTI1ZjQwNGI4YzU5N2QiLCJpYXQiOjE3NTM3ODA0NTd9.TZfHqzweHCK42Dii3gHFwn7FoQf0sIqRJjpMm-3SdbA";

let chosen = null;
let baseAmt = 0;
let mult = 1;

async function fetchWallet() {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  if (res.ok) {
    const { wallet } = await res.json();
    document.getElementById("wallet").innerText = wallet.toFixed(2);
  }
}

async function fetchRound() {
  const res = await fetch(`${API_BASE}/rounds/current`);
  if (!res.ok) return;
  const data = await res.json();
  document.getElementById("roundId").innerText = data.roundId;
  document.getElementById("lastResult").innerText = data.result || "Pending";

  const start = new Date(data.timestamp).getTime();
  const end = start + 30000; // 30s window
  startTimer(end);

  updateHistory([data]);
}

function startTimer(endTime) {
  function tick() {
    const left = Math.floor((endTime - Date.now()) / 1000);
    document.getElementById("timer").innerText = left >= 0 ? left : 0;
    if (left >= 0) setTimeout(tick, 1000);
  }
  tick();
}

function updateHistory(arr) {
  const ul = document.getElementById("historyList");
  ul.innerHTML = "";
  arr.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `Round ${r.roundId}: ${r.result || "-"} (${r.bets?.length || 0} bets)`;
    ul.appendChild(li);
  });
}

document.querySelectorAll(".choice-btn").forEach(btn => {
  btn.onclick = () => {
    chosen = btn.dataset.choice;
    document.getElementById("selectedChoice").innerText = chosen;
  };
});

document.getElementById("baseAmount").onchange = e => {
  baseAmt = parseInt(e.target.value);
};
document.getElementById("multiplier").onchange = e => {
  mult = parseInt(e.target.value);
};

document.getElementById("placeBetBtn").onclick = () => {
  if (!chosen) return alert("Select choice first");
  const total = baseAmt * mult;
  document.getElementById("popupText").innerText =
    `Bet: ${chosen} × ₹${baseAmt} ×${mult} = ₹${total}`;
  document.getElementById("betPopup").classList.remove("hidden");
};

document.getElementById("confirmBtn").onclick = async () => {
  const totalAmt = baseAmt * mult;
  const roundRes = await fetch(`${API_BASE}/rounds/current`);
  const { roundId } = await roundRes.json();

  const payload = { roundId, amount: totalAmt };
  if (!isNaN(Number(chosen))) payload.number = Number(chosen);
  else payload.color = chosen;

  const res = await fetch(`${API_BASE}/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (res.ok) {
    alert("Bet placed ₹" + totalAmt);
    fetchWallet();
    closePopup();
  } else {
    alert(json.error || "Bet error");
  }
};

function closePopup() {
  document.getElementById("betPopup").classList.add("hidden");
}

function showSection(id) {
  document.querySelectorAll(".info-section").forEach(div => {
    div.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

window.onload = () => {
  fetchWallet();
  fetchRound();
};
