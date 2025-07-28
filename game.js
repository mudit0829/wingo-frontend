let walletAmount = 1000;
let roundNumber = 1234;
let timer = 25;

const walletAmountEl = document.getElementById('wallet-amount');
const timerEl = document.getElementById('timer');
const roundNumberEl = document.getElementById('round-number');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const betTypeEl = document.getElementById('bet-type');
const selectedValueEl = document.getElementById('selected-value');
const multiplierEl = document.getElementById('multiplier');
const betAmountEl = document.getElementById('bet-amount');
const confirmBetBtn = document.getElementById('confirm-bet');
const recentResultsTbody = document.getElementById('recent-results').querySelector('tbody');
const myGameHistoryTbody = document.getElementById('my-game-history').querySelector('tbody');

function updateWalletDisplay() {
  walletAmountEl.textContent = `Wallet: ₹${walletAmount}`;
}
updateWalletDisplay();

function updateTimer() {
  timer--;
  if (timer <= 0) {
    roundNumber++;
    timer = 25;
    updateRoundDisplay();
    addToRecentResults();
  }
  timerEl.textContent = `${timer}s`;
}
setInterval(updateTimer, 1000);

function updateRoundDisplay() {
  roundNumberEl.textContent = roundNumber;
}
updateRoundDisplay();

function openBetPopup(type, value) {
  betTypeEl.textContent = type;
  selectedValueEl.textContent = value;
  betAmountEl.value = '';
  multiplierEl.value = '2';
  popup.style.display = 'block';
  overlay.style.display = 'block';
}

function closeBetPopup() {
  popup.style.display = 'none';
  overlay.style.display = 'none';
}

document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => openBetPopup('Color', btn.textContent.trim()));
});
document.querySelectorAll('.number-btn').forEach(btn => {
  btn.addEventListener('click', () => openBetPopup('Number', btn.textContent.trim()));
});

confirmBetBtn.addEventListener('click', () => {
  const type = betTypeEl.textContent;
  const value = selectedValueEl.textContent;
  const amount = parseInt(betAmountEl.value);
  const multiplier = parseFloat(multiplierEl.value);

  if (isNaN(amount) || amount <= 0 || amount > walletAmount) {
    alert("Invalid amount.");
    return;
  }

  walletAmount -= amount;
  updateWalletDisplay();
  addToGameHistory(roundNumber, type, value, amount, multiplier);
  closeBetPopup();
});

function addToRecentResults() {
  const fakeResult = Math.floor(Math.random() * 10);
  const row = document.createElement('tr');
  row.innerHTML = `<td>${roundNumber}</td><td>${fakeResult}</td><td>${new Date().toLocaleTimeString()}</td>`;
  recentResultsTbody.prepend(row);
  if (recentResultsTbody.rows.length > 5) recentResultsTbody.deleteRow(-1);
}

function addToGameHistory(round, type, value, amount, multiplier) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${round}</td>
    <td>${type}</td>
    <td>${value}</td>
    <td>₹${amount}</td>
    <td>x${multiplier}</td>
  `;
  myGameHistoryTbody.prepend(row);
}
