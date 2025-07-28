const apiUrl = 'https://wingo-backend-nqk5.onrender.com';
let token = localStorage.getItem('token');
let username = localStorage.getItem('username');

if (!token || !username) {
  window.location.href = 'login.html';
}

document.getElementById('username').innerText = username;

// Generate number buttons 0-9
const numberContainer = document.getElementById('numberButtons');
for (let i = 0; i <= 9; i++) {
  const btn = document.createElement('button');
  btn.innerText = i;
  btn.onclick = () => placeBet(i.toString());
  numberContainer.appendChild(btn);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

// Countdown Timer
let timeLeft = 25;
let inDrawPhase = false;
updateTimerDisplay();

setInterval(() => {
  timeLeft--;
  if (timeLeft <= 0) {
    if (!inDrawPhase) {
      inDrawPhase = true;
      timeLeft = 5; // 5 seconds waiting phase
    } else {
      inDrawPhase = false;
      timeLeft = 25; // new round
      fetchRounds();     // update round results
      fetchMyHistory();  // update user's bet history
    }
  }
  updateTimerDisplay();
}, 1000);

function updateTimerDisplay() {
  document.getElementById('timeLeft').innerText = timeLeft;
}

// Place bet
function placeBet(betValue) {
  const amount = document.getElementById('amount').value;
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const payload = {
    username,
    amount,
    betType: isNaN(betValue) ? 'color' : 'number',
    betValue,
  };

  fetch(`${apiUrl}/api/bets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Bet placed successfully!');
        fetchMyHistory(); // refresh user history
      } else {
        alert(data.message || 'Bet failed!');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error placing bet.');
    });
}

// Fetch last 10 rounds
function fetchRounds() {
  fetch(`${apiUrl}/api/rounds`)
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('roundsTable');
      table.innerHTML = '';
      const last10 = data.slice(-10).reverse();

      last10.forEach(round => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${round.roundId}</td>
          <td>${round.result !== null ? round.result : '-'}</td>
          <td>${new Date(round.timestamp).toLocaleTimeString()}</td>
        `;
        table.appendChild(tr);
      });
    });
}

// Fetch user history
function fetchMyHistory() {
  fetch(`${apiUrl}/api/bets/user/${username}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('historyTable');
      table.innerHTML = '';
      const last10 = data.slice(-10).reverse();

      last10.forEach(bet => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${bet.roundId}</td>
          <td>${bet.colorBet || '-'}</td>
          <td>${bet.numberBet || '-'}</td>
          <td>${bet.amount}</td>
          <td>${bet.result !== undefined ? bet.result : '-'}</td>
        `;
        table.appendChild(tr);
      });
    });
}

// Load on page start
fetchRounds();
fetchMyHistory();
