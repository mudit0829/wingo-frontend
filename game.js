const API_BASE = 'https://wingo-backend-nqk5.onrender.com';
const demoEmail = 'user@example.com';

let currentRoundId = '';
let countdown = 30;
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  loadWallet();
  loadLastResult();
  startCountdown();
  fetchLatestRound();

  document.getElementById('placeBetBtn').addEventListener('click', placeBet);
});

// Load wallet balance
function loadWallet() {
  fetch(`${API_BASE}/api/users/wallet/${demoEmail}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('walletBalance').innerText = `₹${data.wallet.toFixed(2)}`;
    })
    .catch(() => {
      document.getElementById('walletBalance').innerText = '₹0';
    });
}

// Fetch latest roundId
function fetchLatestRound() {
  fetch(`${API_BASE}/api/rounds`)
    .then(res => res.json())
    .then(data => {
      const latestRound = data[data.length - 1];
      currentRoundId = latestRound.roundId;
      document.getElementById('currentRound').innerText = `Round: ${currentRoundId}`;
    })
    .catch(() => {
      document.getElementById('currentRound').innerText = 'Round: N/A';
    });
}

// Load last round result
function loadLastResult() {
  fetch(`${API_BASE}/api/rounds`)
    .then(res => res.json())
    .then(data => {
      if (data.length < 2) return;
      const lastRound = data[data.length - 2]; // Second last round is last completed
      document.getElementById('lastResult').innerText =
        `Result: ${lastRound.result} (ID: ${lastRound.roundId})`;
    })
    .catch(() => {
      document.getElementById('lastResult').innerText = 'Result: N/A';
    });
}

// Countdown timer
function startCountdown() {
  countdownInterval = setInterval(() => {
    countdown--;
    document.getElementById('countdownTimer').innerText = `${countdown}s`;

    if (countdown === 0) {
      clearInterval(countdownInterval);
      setTimeout(() => {
        countdown = 30;
        fetchLatestRound();
        loadLastResult();
        startCountdown();
      }, 3000); // Small delay before next round
    }
  }, 1000);
}

// Place bet
function placeBet() {
  const color = document.querySelector('input[name="color"]:checked')?.value;
  const number = parseInt(document.getElementById('numberSelect').value);
  const amount = parseFloat(document.getElementById('betAmount').value);

  if (!color && isNaN(number)) {
    alert('Select a color or number to bet.');
    return;
  }

  if (!amount || amount < 1) {
    alert('Enter a valid bet amount (₹1 or more).');
    return;
  }

  const netAmount = parseFloat((amount * 0.98).toFixed(2)); // Deduct 2% service fee

  const payload = {
    email: demoEmail,
    roundId: currentRoundId,
    colorBet: color || null,
    numberBet: isNaN(number) ? null : number,
    amount,
    netAmount,
  };

  fetch(`${API_BASE}/api/bets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Bet placed successfully') {
        alert('Bet placed!');
        loadWallet();
      } else {
        alert(data.message || 'Bet failed');
      }
    })
    .catch(() => {
      alert('Server error while placing bet.');
    });
}
