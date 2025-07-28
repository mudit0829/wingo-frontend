const API_URL = 'https://wingo-backend-nqk5.onrender.com'; // Your backend

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
document.getElementById('username').textContent = username || '';

async function fetchWallet() {
  const res = await fetch(`${API_URL}/api/users/${username}`);
  const data = await res.json();
  document.getElementById('wallet').textContent = data.wallet || '0';
}

async function getCurrentRound() {
  const res = await fetch(`${API_URL}/api/rounds`);
  const rounds = await res.json();
  const latest = rounds[rounds.length - 1];
  document.getElementById('currentRound').textContent = latest.roundId;
  return latest;
}

async function placeColorBet(color) {
  const amount = parseFloat(document.getElementById('betAmount').value);
  const round = await getCurrentRound();
  const payload = {
    username,
    roundId: round.roundId,
    color,
    amount
  };

  const res = await fetch(`${API_URL}/api/bets/color`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  document.getElementById('status').innerText = data.message || 'Bet placed!';
  fetchWallet();
}

async function placeNumberBet() {
  const amount = parseFloat(document.getElementById('betAmount').value);
  const number = document.getElementById('numberBet').value;
  const round = await getCurrentRound();

  const payload = {
    username,
    roundId: round.roundId,
    number,
    amount
  };

  const res = await fetch(`${API_URL}/api/bets/number`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  document.getElementById('status').innerText = data.message || 'Number bet placed!';
  fetchWallet();
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

fetchWallet();
getCurrentRound();

let countdown = 25;
setInterval(() => {
  countdown--;
  if (countdown <= 0) {
    countdown = 30;
  }
  document.getElementById('timer').innerText = countdown;
}, 1000);
