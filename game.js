// Dummy wallet balance
let wallet = 1000;

// Current round and timer
let currentRound = 123;
let timeLeft = 25;
let timerInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("wallet-balance").innerText = `₹ ${wallet}`;
  updateRoundAndTimer();
  loadRecentResults();
  loadMyGameHistory();

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      currentRound++;
      timeLeft = 30;
      updateRoundAndTimer();
    }
    document.getElementById("timer").innerText = `${timeLeft}s`;
  }, 1000);
});

function updateRoundAndTimer() {
  document.getElementById("round-number").innerText = `#${currentRound}`;
}

// Popup logic
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const betAmountInput = document.getElementById("bet-amount");
const multiplierText = document.getElementById("multiplier");

let selectedType = '';
let selectedValue = '';
let selectedMultiplier = 0;

function openPopup(type, value) {
  selectedType = type;
  selectedValue = value;
  selectedMultiplier = getMultiplier(type, value);
  popupTitle.innerText = `Place Bet on ${value}`;
  multiplierText.innerText = `Payout: x${selectedMultiplier}`;
  betAmountInput.value = '';
  popup.style.display = "block";
}

function closePopup() {
  popup.style.display = "none";
}

function placeBet() {
  const amount = parseFloat(betAmountInput.value);
  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  const serviceFee = 0.02 * amount;
  const finalAmount = amount - serviceFee;
  const potentialWin = finalAmount * selectedMultiplier;

  wallet -= amount;
  document.getElementById("wallet-balance").innerText = `₹ ${wallet}`;

  addToGameHistory(currentRound, selectedType, selectedValue, amount, potentialWin);
  closePopup();
}

function getMultiplier(type, value) {
  if (type === 'color') {
    if (value === 'Red' || value === 'Green') return 2;
    if (value === 'Violet') return 4.5;
  } else if (type === 'number') {
    return 9;
  }
  return 0;
}

// Load dummy recent results
function loadRecentResults() {
  const resultsTable = document.getElementById("results-table");
  const dummy = [
    { round: 120, number: 5, color: 'Violet' },
    { round: 121, number: 7, color: 'Red' },
    { round: 122, number: 2, color: 'Green' }
  ];

  dummy.reverse().forEach(res => {
    const row = resultsTable.insertRow(1);
    row.innerHTML = `
      <td>#${res.round}</td>
      <td>${res.number}</td>
      <td><div class="color-box color-${res.color.toLowerCase()}"></div> ${res.color}</td>
    `;
  });
}

function loadMyGameHistory() {
  const historyTable = document.getElementById("history-table");
  // Clear existing
  historyTable.innerHTML = `
    <tr>
      <th>Round</th><th>Type</th><th>Value</th><th>Amount</th><th>Payout</th>
    </tr>
  `;
}

function addToGameHistory(round, type, value, amount, payout) {
  const historyTable = document.getElementById("history-table");
  const row = historyTable.insertRow(1);
  row.innerHTML = `
    <td>#${round}</td>
    <td>${type}</td>
    <td>${value}</td>
    <td>₹${amount}</td>
    <td>₹${payout.toFixed(2)}</td>
  `;
}
