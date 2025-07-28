let wallet = 1000;
let currentBet = {};
let round = 1;
let timer = 30;

const walletAmount = document.getElementById("walletAmount");
const popup = document.getElementById("popup");
const betAmountInput = document.getElementById("betAmount");
const popupTitle = document.getElementById("popupTitle");
const gameHistory = document.getElementById("gameHistory");
const timerSpan = document.getElementById("timer");
const roundSpan = document.getElementById("roundNumber");

function updateWallet() {
  walletAmount.textContent = wallet;
}

function deposit() {
  wallet += 500;
  updateWallet();
}

function withdraw() {
  wallet = Math.max(0, wallet - 500);
  updateWallet();
}

function selectAmount(amount) {
  betAmountInput.value = amount;
}

function showPopup(title, type, value) {
  currentBet = { type, value };
  popupTitle.textContent = `${title}`;
  popup.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
  currentBet = {};
  betAmountInput.value = "";
}

function confirmBet() {
  const amount = parseInt(betAmountInput.value);
  if (isNaN(amount) || amount <= 0 || amount > wallet) {
    alert("Invalid amount");
    return;
  }
  const finalAmount = Math.floor(amount * 0.98);
  wallet -= amount;
  updateWallet();

  // Store bet temporarily (to simulate real backend later)
  alert(`Bet placed on ${currentBet.type}: ${currentBet.value} for ₹${finalAmount}`);
  closePopup();
}

document.querySelectorAll(".bet-btn.red, .bet-btn.green, .bet-btn.violet").forEach(btn => {
  btn.addEventListener("click", () => {
    const color = btn.dataset.color;
    showPopup(`Bet on ${color}`, "color", color);
  });
});

document.querySelectorAll(".bet-btn.number").forEach(btn => {
  btn.addEventListener("click", () => {
    const number = btn.dataset.number;
    showPopup(`Bet on Number ${number}`, "number", number);
  });
});

// Round Timer
setInterval(() => {
  timer--;
  if (timer <= 0) {
    timer = 30;
    round++;
    roundSpan.textContent = round;

    const result = Math.floor(Math.random() * 10);
    const colorResult = [1,3,7,9].includes(result) ? 'Red' : [2,4,6,8].includes(result) ? 'Green' : 'Violet';

    const row = `<tr>
      <td>${round}</td>
      <td>${result} (${colorResult})</td>
      <td>${new Date().toLocaleTimeString()}</td>
    </tr>`;
    gameHistory.innerHTML = row + gameHistory.innerHTML;
  }
  timerSpan.textContent = timer;
}, 1000);
