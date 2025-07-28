const roundSpan = document.getElementById('roundId');
const timerEl = document.getElementById('timer');
const walletBalance = document.getElementById('walletBalance');

let roundNumber = 1012;
let wallet = 1000;
let betTarget = {};
let timer = 25;
let gameHistory = [];
let results = [];

// Update timer
setInterval(() => {
  timer--;
  if (timer <= 0) {
    generateResult();
    timer = 25;
    roundNumber++;
    roundSpan.textContent = '#' + roundNumber;
  }
  timerEl.textContent = timer;
}, 1000);

// Add bet listeners
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.betType;
    const value = btn.dataset.value;
    showPopup(type, value);
  });
});

function showPopup(type, value) {
  betTarget = { type, value };
  document.getElementById('popupTitle').textContent = `Bet on ${type}: ${value}`;
  document.getElementById('popup').classList.remove('hidden');
}

document.getElementById('closePopup').onclick = () => {
  document.getElementById('popup').classList.add('hidden');
};

document.getElementById('placeBetBtn').onclick = () => {
  const amount = parseInt(document.getElementById('betAmount').value) || 0;
  const multiplier = document.querySelector('.multiplier-btn.selected')?.dataset.multiplier || 1;

  if (amount > 0 && amount <= wallet) {
    wallet -= amount;
    walletBalance.textContent = wallet;

    gameHistory.unshift({
      round: roundNumber,
      type: betTarget.type,
      value: betTarget.value,
      amount,
      multiplier
    });

    updateHistory();
    document.getElementById('popup').classList.add('hidden');
  }
};

document.querySelectorAll('.multiplier-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.multiplier-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

function updateHistory() {
  const body = document.getElementById('historyBody');
  body.innerHTML = '';
  gameHistory.slice(0, 5).forEach(bet => {
    const row = `<tr><td>${bet.round}</td><td>${bet.type}</td><td>${bet.value}</td><td>₹${bet.amount} x${bet.multiplier}</td></tr>`;
    body.innerHTML += row;
  });
}

function generateResult() {
  const number = Math.floor(Math.random() * 10);
  let color = '';
  if ([1, 3, 7, 9].includes(number)) color = 'Green';
  else if ([2, 4, 6, 8].includes(number)) color = 'Red';
  else if ([0, 5].includes(number)) color = 'Violet';

  results.unshift({ round: roundNumber, number, color });
  updateResults();
}

function updateResults() {
  const body = document.getElementById('recentResultsBody');
  body.innerHTML = '';
  results.slice(0, 5).forEach(result => {
    const row = `<tr><td>${result.round}</td><td>${result.number}</td><td>${result.color}</td></tr>`;
    body.innerHTML += row;
  });
}
