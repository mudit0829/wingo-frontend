const API_URL = 'https://wingo-backend-nqk5.onrender.com';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MjY0MTUyYTI1ZjQwNGI4YzU5N2QiLCJpYXQiOjE3NTM3NjczOTV9.9LOI9UD0Fjic6SmWREqe08A1gqImyO_nFwOLLpnxZIc';

let currentRoundId = '';
let selectedBetType = '';
let selectedNumber = null;
let selectedAmount = 0;

function fetchWallet() {
  fetch(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('wallet-balance').innerText = data.wallet || 0;
    });
}

function fetchRound() {
  fetch(`${API_URL}/api/rounds/latest`)
    .then(res => res.json())
    .then(data => {
      currentRoundId = data.roundId;
      document.getElementById('round-id').innerText = currentRoundId;
    });
}

function fetchResult() {
  fetch(`${API_URL}/api/rounds/last-result`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('last-result').innerText = `${data.color} - ${data.number}`;
    });
}

function startTimer(seconds = 25) {
  let countdown = seconds;
  const timer = setInterval(() => {
    document.getElementById('countdown').innerText = countdown;
    countdown--;
    if (countdown < 0) clearInterval(timer);
  }, 1000);
}

function openBetPopup(typeOrNumber) {
  selectedBetType = ['red', 'green', 'violet'].includes(typeOrNumber) ? typeOrNumber : 'number';
  selectedNumber = selectedBetType === 'number' ? parseInt(typeOrNumber) : null;
  document.getElementById('popup-bet-type').innerText = selectedBetType === 'number' ? `Number ${selectedNumber}` : typeOrNumber;
  document.getElementById('bet-popup').classList.remove('hidden');
}

function selectAmount(amt) {
  document.getElementById('bet-amount').value = amt;
}

function closePopup() {
  document.getElementById('bet-popup').classList.add('hidden');
  document.getElementById('bet-amount').value = '';
  selectedAmount = 0;
  selectedNumber = null;
}

function placeBet() {
  const amount = parseFloat(document.getElementById('bet-amount').value);
  if (!amount || amount <= 0) return alert('Enter a valid amount.');

  const body = {
    roundId: currentRoundId,
    amount,
    ...(selectedBetType === 'number' ? { number: selectedNumber } : { color: selectedBetType })
  };

  fetch(`${API_URL}/api/bets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      alert('Bet placed successfully!');
      closePopup();
      fetchWallet();
    });
}

function generateNumberButtons() {
  const container = document.getElementById('number-buttons');
  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.onclick = () => openBetPopup(i);
    container.appendChild(btn);
  }
}

window.onload = function () {
  fetchWallet();
  fetchRound();
  fetchResult();
  startTimer();
  generateNumberButtons();
  setInterval(fetchRound, 30000);
  setInterval(fetchResult, 30000);
  setInterval(fetchWallet, 60000);
};
