const API_BASE = 'https://wingo-backend-nqk5.onrender.com';

let token = localStorage.getItem('token');
let username = localStorage.getItem('username');

if (!token || !username) {
    window.location.href = 'login.html';
}

// Show username
document.getElementById('username').textContent = username;

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// Timer countdown
let timeLeft = 25;
const timerDisplay = document.getElementById('timer');

function startTimer() {
    timeLeft = 25;
    timerDisplay.textContent = `Time Left: ${timeLeft} seconds`;

    const interval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(interval);
        }
    }, 1000);
}

startTimer();
setInterval(startTimer, 30000); // New round every 30 seconds

// Place Bet
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => placeBet(btn.dataset.color, null));
});

document.getElementById('numberButtons').addEventListener('click', (e) => {
    if (e.target.classList.contains('num-btn')) {
        placeBet(null, parseInt(e.target.dataset.num));
    }
});

function placeBet(color, number) {
    const amount = parseFloat(document.getElementById('amount').value);
    if (!amount || amount < 1) return alert('Enter valid amount');

    fetch(`${API_BASE}/api/bets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, color, number, amount })
    })
    .then(res => res.json())
    .then(data => {
        alert('Bet placed!');
        fetchHistory();
    })
    .catch(err => console.error('Bet error:', err));
}

// Show Recent Results
function fetchResults() {
    fetch(`${API_BASE}/api/rounds`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById('resultTable');
            table.innerHTML = '';
            data.slice(-10).reverse().forEach(r => {
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${r.roundId}</td>
                    <td>${r.result}</td>
                    <td>${new Date(r.timestamp).toLocaleTimeString()}</td>
                `;
            });
        });
}

// Show User History
function fetchHistory() {
    fetch(`${API_BASE}/api/bets/user/${username}`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById('historyTable');
            table.innerHTML = '';
            data.slice(-10).reverse().forEach(b => {
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${b.roundId}</td>
                    <td>${b.color || b.number}</td>
                    <td>${b.amount}</td>
                    <td>${new Date(b.timestamp).toLocaleTimeString()}</td>
                `;
            });
        });
}

fetchResults();
fetchHistory();
setInterval(fetchResults, 10000);
