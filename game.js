let selectedBet = null;
let selectedAmount = 1;
let selectedMultiplier = 1;
let currentRoundId = null;

function fetchWallet() {
  fetch('https://wingo-backend-nqk5.onrender.com/api/users/me')
    .then(res => res.json())
    .then(data => {
      document.getElementById('walletAmount').textContent = data.wallet || 0;
    })
    .catch(() => console.error('Wallet fetch failed'));
}

function fetchRound() {
  fetch('https://wingo-backend-nqk5.onrender.com/api/rounds/current')
    .then(res => res.json())
    .then(data => {
      currentRoundId = data.roundId;
      document.getElementById('roundId').textContent = currentRoundId;
      startTimer(data.remainingTime || 25);
    })
    .catch(() => console.error('Round fetch failed'));
}

function fetchResult() {
  fetch('https://wingo-backend-nqk5.onrender.com/api/rounds/last-result')
    .then(res => res.json())
    .then(data => {
      document.getElementById('lastResult').textContent = data.result || '-';
    })
    .catch(() => console.error('Result fetch failed'));
}

function startTimer(duration) {
  let timer = duration;
  const timerDisplay = document.getElementById('timer');
  const interval = setInterval(() => {
    timerDisplay.textContent = timer;
    if (--timer < 0) clearInterval(interval);
  }, 1000);
}

function setAmount(amount) {
  selectedAmount = amount;
}

function setMultiplier(mult) {
  selectedMultiplier = mult;
}

function selectBet(choice) {
  selectedBet = choice;
}

function confirmBet() {
  if (!selectedBet || !selectedAmount || !selectedMultiplier) {
    alert('Select a bet, amount, and multiplier first.');
    return;
  }

  const totalAmount = selectedAmount * selectedMultiplier;

  document.getElementById('betChoiceText').textContent = selectedBet;
  document.getElementById('baseAmountText').textContent = selectedAmount;
  document.getElementById('multiplierText').textContent = selectedMultiplier;
  document.getElementById('totalAmountText').textContent = totalAmount;

  document.getElementById('betPopup').style.display = 'block';
}

function closePopup() {
  document.getElementById('betPopup').style.display = 'none';
}

function placeBet() {
  const finalAmount = selectedAmount * selectedMultiplier;
  const payload = {
    roundId: currentRoundId,
    amount: finalAmount,
  };

  if (typeof selectedBet === 'number') {
    payload.number = selectedBet;
  } else {
    payload.color = selectedBet;
  }

  fetch('https://wingo-backend-nqk5.onrender.com/api/bets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(data => {
      alert('Bet placed!');
      closePopup();
      fetchWallet();
    })
    .catch(err => {
      console.error('Bet error:', err);
      alert('Failed to place bet');
    });
}

window.onload = () => {
  fetchWallet();
  fetchRound();
  fetchResult();
};
