const API_BASE = 'https://wingo-backend-nqk5.onrender.com';
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (!token || !username) {
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

function updateWallet() {
  fetch(`${API_BASE}/api/users/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('walletBalance').innerText = data.wallet.toFixed(2);
    });
}

function placeBet(type) {
  const amount = parseFloat(document.getElementById('betAmount').value);
  if (!amount || amount < 1) return alert("Enter valid amount");

  let bet = {
    username,
    roundId: currentRoundId,
    amount,
    color: null,
    number: null,
  };

  if (type === 'Red' || type === 'Green' || type === 'Violet') {
    bet.color = type;
  } else {
    bet.number = parseInt(type);
  }

  fetch(`${API_BASE}/api/bets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(bet)
  })
    .then(res => res.json())
    .then(data => {
      alert('Bet Placed!');
      updateWallet();
      fetchUserBets();
    })
    .catch(() => alert("Bet failed"));
}

let currentRoundId = null;

function startTimer() {
  let time = 30;
  const timerElem = document.getElementById('timer');
  const interval = setInterval(() => {
    timerElem.innerText = time;
    time--;
    if (time < 0) {
      clearInterval(interval);
      startTimer();
    }
  }, 1000);
}

function fetchRecentResults() {
  fetch(`${API_BASE}/api/rounds`)
    .then(res => res.json())
    .then(data => {
      const sorted = data.reverse().slice(0, 10);
      const resultsHTML = sorted.map(r => `<span>${r.result}</span>`).join(' | ');
      document.getElementById('recentResults').innerHTML = resultsHTML;
      currentRoundId = sorted[0].roundId + 1;
    });
}

function fetchUserBets() {
  fetch(`${API_BASE}/api/bets/user/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(bets => {
      if (!Array.isArray(bets)) return;
      const tbody = document.getElementById('historyTableBody');
      tbody.innerHTML = '';
      bets.reverse().forEach(bet => {
        const row = `
          <tr>
            <td>${bet.roundId}</td>
            <td>${bet.color || '-'}</td>
            <td>${bet.number !== null ? bet.number : '-'}</td>
            <td>${bet.result || '-'}</td>
            <td>₹${bet.amount}</td>
            <td>₹${bet.payout || 0}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    });
}

function createNumberButtons() {
  const container = document.getElementById('numberButtons');
  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.onclick = () => placeBet(i);
    container.appendChild(btn);
  }
}

window.onload = () => {
  updateWallet();
  fetchRecentResults();
  fetchUserBets();
  createNumberButtons();
  startTimer();
};
