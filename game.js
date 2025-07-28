const backendUrl = 'https://wingo-backend-nqk5.onrender.com';
let token = localStorage.getItem('token');
let username = localStorage.getItem('username');
let currentRoundId = null;
let countdownInterval = null;

if (!token || !username) {
    window.location.href = 'login.html';
}

// Timer countdown
function startCountdown(seconds) {
    const timerDisplay = document.getElementById('timer');
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        timerDisplay.innerText = seconds + 's';
        seconds--;
        if (seconds < 0) {
            clearInterval(countdownInterval);
            timerDisplay.innerText = 'Waiting...';
        }
    }, 1000);
}

// Fetch current round
async function fetchCurrentRound() {
    const res = await fetch(`${backendUrl}/api/rounds`);
    const rounds = await res.json();
    const latestRound = rounds[rounds.length - 1];
    currentRoundId = latestRound.roundId;
    document.getElementById('currentRound').innerText = `Round #${currentRoundId}`;
}

// Fetch user game history
async function fetchUserHistory() {
    const res = await fetch(`${backendUrl}/api/bets/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const bets = await res.json();
    const tbody = document.getElementById('gameHistoryBody');
    tbody.innerHTML = '';

    bets.slice().reverse().forEach(bet => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${bet.roundId}</td>
            <td>${bet.colorBet || '-'}</td>
            <td>${bet.numberBet !== null ? bet.numberBet : '-'}</td>
            <td>${bet.result !== null ? bet.result : '-'}</td>
            <td>${bet.profit !== null ? bet.profit : '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Fetch recent results
async function fetchRecentResults() {
    const res = await fetch(`${backendUrl}/api/rounds`);
    const rounds = await res.json();
    const resultDiv = document.getElementById('recentResults');
    resultDiv.innerHTML = '';

    rounds.slice(-10).reverse().forEach(r => {
        const span = document.createElement('span');
        span.innerText = r.result;
        span.classList.add('result-bubble');
        if (r.result === 0 || r.result === 5) {
            span.classList.add('violet');
        } else if ([1,3,7,9].includes(r.result)) {
            span.classList.add('green');
        } else if ([2,4,6,8].includes(r.result)) {
            span.classList.add('red');
        }
        resultDiv.appendChild(span);
    });
}

// Place bet
async function placeBet() {
    const amount = parseFloat(document.getElementById('betAmount').value);
    const color = document.querySelector('input[name="color"]:checked')?.value;
    const number = document.getElementById('numberBet').value;

    if (!amount || amount < 1 || (!color && number === '')) {
        alert('Please enter valid bet details.');
        return;
    }

    const data = {
        username,
        roundId: currentRoundId,
        amount,
        colorBet: color || null,
        numberBet: number !== '' ? parseInt(number) : null
    };

    const res = await fetch(`${backendUrl}/api/bets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const response = await res.json();
    alert(response.message || 'Bet placed!');
    fetchUserHistory();
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Event listeners
document.getElementById('placeBetBtn').addEventListener('click', placeBet);
document.getElementById('logoutBtn').addEventListener('click', logout);

// Init
fetchCurrentRound();
fetchUserHistory();
fetchRecentResults();
startCountdown(25);
setInterval(fetchCurrentRound, 10000);
setInterval(fetchRecentResults, 15000);
setInterval(fetchUserHistory, 20000);
