let round = 1;
let wallet = 1000;
let timer = 25;
let timerInterval;
let selectedBet = { type: '', value: '' };

document.addEventListener('DOMContentLoaded', () => {
  updateWallet();
  updateRound();
  startTimer();
  attachBetListeners();
});

function updateWallet() {
  document.getElementById('wallet').textContent = wallet;
}

function updateRound() {
  document.getElementById('round-number').textContent = `Round: #${round.toString().padStart(4, '0')}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (timer > 0) {
      timer--;
      document.getElementById('timer').textContent = `00:${timer.toString().padStart(2, '0')}`;
    } else {
      clearInterval(timerInterval);
      timer = 25;
      round++;
      updateRound();
      updateHistory();
      startTimer();
    }
  }, 1000);
}

function attachBetListeners() {
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedBet = { type: 'color', value: btn.dataset.color };
      openPopup(`Bet on ${btn.dataset.color}`);
    });
  });
  document.querySelectorAll('.number-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedBet = { type: 'number', value: btn.dataset.number };
      openPopup(`Bet on Number ${btn.dataset.number}`);
    });
  });
}

function openPopup(title) {
  document.getElementById('bet-title').textContent = title;
  document.getElementById('betPopup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('betPopup').style.display = 'none';
}

function placeBet(amount) {
  if (wallet >= amount) {
    wallet -= amount;
    updateWallet();
    alert(`Bet placed on ${selectedBet.value} for ₹${amount}`);
    closePopup();
  } else {
    alert("Insufficient balance");
  }
}

function updateHistory() {
  const tbody = document.getElementById('history-body');
  const row = document.createElement('tr');
  const resultNumber = Math.floor(Math.random() * 10);
  const resultColor = getColorFromNumber(resultNumber);

  row.innerHTML = `
    <td>#${round.toString().padStart(4, '0')}</td>
    <td>${resultNumber}</td>
    <td>${resultColor}</td>
    <td>${new Date().toLocaleTimeString()}</td>
  `;
  tbody.prepend(row);
}

function getColorFromNumber(num) {
  if ([1,3,7,9].includes(num)) return 'Red';
  if ([0,2,4,6,8].includes(num)) return 'Green';
  return 'Violet';
}
