let wallet = 1000;
let currentRound = 12345;
let popup = document.getElementById('bet-popup');
let selectedOption = '';
let selectedType = '';
let selectedMultiplier = 1;

document.getElementById('wallet-amount').innerText = wallet;
document.getElementById('round-number').innerText = currentRound;
document.getElementById('timer').innerText = '25s';

function openPopup(type, value) {
  selectedType = type;
  selectedOption = value;
  document.getElementById('selected-info').innerText = `Placing Bet for: ${value}`;
  document.getElementById('bet-amount').value = '';
  selectedMultiplier = 1;
  popup.style.display = 'block';
}

function closePopup() {
  popup.style.display = 'none';
}

function selectMultiplier(x) {
  selectedMultiplier = x;
}

function placeBet() {
  let amount = parseInt(document.getElementById('bet-amount').value);
  if (isNaN(amount) || amount <= 0) {
    alert('Enter valid amount!');
    return;
  }
  let finalAmount = amount * selectedMultiplier;
  if (wallet < finalAmount) {
    alert('Insufficient balance');
    return;
  }
  wallet -= finalAmount;
  document.getElementById('wallet-amount').innerText = wallet;
  addToHistory(currentRound, selectedOption);
  closePopup();
}

function addToHistory(round, result) {
  let row = `<tr><td>${round}</td><td>${result}</td></tr>`;
  document.getElementById('history-body').innerHTML = row + document.getElementById('history-body').innerHTML;
}

// Simulate round every 30s
setInterval(() => {
  currentRound++;
  document.getElementById('round-number').innerText = currentRound;
  let timer = 25;
  let interval = setInterval(() => {
    if (timer <= 0) clearInterval(interval);
    document.getElementById('timer').innerText = `${timer--}s`;
  }, 1000);
}, 30000);

// Attach button events
document.querySelectorAll('.bet-btn').forEach(btn => {
  btn.onclick = () => openPopup('color', btn.dataset.value);
});
document.querySelectorAll('.number-btn').forEach(btn => {
  btn.onclick = () => openPopup('number', btn.dataset.value);
});
document.querySelectorAll('.multiplier-btn').forEach(btn => {
  btn.onclick = () => selectMultiplier(parseInt(btn.innerText.replace('x','')));
});
