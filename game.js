const API_BASE = 'https://wingo-backend-nqk5.onrender.com';

// Get token and username from localStorage
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

// DOM elements
const userSpan = document.getElementById('user');
const timerSpan = document.getElementById('timer');
const amountInput = document.getElementById('amount');
const roundTable = document.getElementById('roundTable');
const logoutBtn = document.getElementById('logoutBtn');
const numberBetsContainer = document.getElementById('numberBets');

// Redirect to login if not logged in
if (!token || !username) {
  window.location.href = 'login.html';
}

// Show username
userSpan.textContent = username;

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

// Timer countdown
let secondsLeft = 30;
function updateTimer() {
  timerSpan.textContent = `${secondsLeft} seconds`;
  secondsLeft--;
  if (secondsLeft < 0) {
    secondsLeft = 30;
  }
}
setInterval(updateTimer, 1000);
updateTimer();

// Bet handler
async function placeBet(color, number) {
  const amount = parseFloat(amountInput.value);
  if (!amount || amount <= 0) {
    alert('Enter valid amount');
    return;
  }

  const betData = {
    username,
    amount,
    color: color || null,
    number: number ?? null
  };

  try {
    const res = await fetch(`${API_BASE}/api/bets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(betData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Bet failed');
    alert('Bet placed!');
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// Attach color button events
document.getElementById('redBtn').addEventListener('click', () => placeBet('Red'));
document.getElementById('greenBtn').addEventListener('click', () => placeBet('Green'));
document.getElementById('violetBtn').addEventListener('click', () => placeBet('Violet'));

// Generate number bet buttons
for (let i = 0; i < 10; i++) {
  const btn = document.createElement('button');
  btn.textContent = i;
  btn.onclick = () => placeBet(null, i);
  numberBetsContainer.appendChild(btn);
}

// Load recent rounds
async function loadRounds() {
  try {
    const res = await fetch(`${API_BASE}/api/rounds`);
    const rounds = await res.json();
    roundTable.innerHTML = `
      <tr><th>Round ID</th><th>Result</th><th>Time</th></tr>
      ${rounds
        .slice(-5)
        .reverse()
        .map(
          (r) => `
        <tr>
          <td>${r.roundId}</td>
          <td>${r.result || 'Pending'}</td>
          <td>${new Date(r.timestamp).toLocaleTimeString()}</td>
        </tr>
      `
        )
        .join('')}
    `;
  } catch (err) {
    roundTable.innerHTML = '<tr><td colspan="3">Error loading rounds</td></tr>';
  }
}
setInterval(loadRounds, 3000);
loadRounds();
