const apiBase = 'https://wingo-backend-nqk5.onrender.com';
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');

document.getElementById('usernameDisplay').textContent = username || 'Unknown';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

async function placeBet(type, value) {
  const amount = parseFloat(document.getElementById('betAmount').value);
  if (!amount || amount < 1) return alert('Enter valid amount');

  try {
    const res = await fetch(`${apiBase}/api/bets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        amount,
        [type]: value
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Bet placed on ${type === 'color' ? 'Color' : 'Number'}: ${value}`);
    } else {
      alert(data.message || 'Failed to place bet');
    }
  } catch (err) {
    console.error(err);
    alert('Error placing bet');
  }
}

function updateCountdown() {
  const now = new Date();
  const seconds = now.getSeconds();
  const remaining = 30 - (seconds % 30);
  document.getElementById('countdown').textContent = remaining;
}

setInterval(updateCountdown, 1000);

async function loadGameHistory() {
  try {
    const res = await fetch(`${apiBase}/api/rounds`);
    const data = await res.json();

    const rows = data.slice(-10).reverse().map(round => `
      <tr>
        <td>${round.roundId || '-'}</td>
        <td>${round.result ?? '-'}</td>
        <td>${new Date(round.timestamp).toLocaleTimeString()}</td>
      </tr>
    `).join('');

    document.querySelector('#historyTable tbody').innerHTML = rows;
  } catch (err) {
    console.error('Failed to load history', err);
  }
}

loadGameHistory();
setInterval(loadGameHistory, 10000);
