let selectedColor = "";
let selectedNumber = null;
let walletBalance = 1000;
let currentRound = 1234;
let timer = 25;

document.addEventListener("DOMContentLoaded", () => {
  updateTimer();
  updateWalletDisplay();
  setInterval(updateTimer, 1000);
});

function updateTimer() {
  const timerEl = document.getElementById("timer");
  if (timerEl) {
    timerEl.textContent = `Time Left: ${timer}s`;
    timer--;
    if (timer < 0) {
      timer = 25;
      currentRound++;
      document.getElementById("roundNo").textContent = `Round #${currentRound}`;
    }
  }
}

function updateWalletDisplay() {
  const walletEl = document.getElementById("walletBalance");
  if (walletEl) {
    walletEl.textContent = walletBalance;
  }
}

function openColorPopup() {
  document.getElementById("colorPopup").classList.remove("hidden");
}

function openNumberPopup() {
  document.getElementById("numberPopup").classList.remove("hidden");
}

function closePopup() {
  document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
}

function selectColor(color) {
  selectedColor = color;
  document.getElementById("selectedColor").textContent = color;
  openColorPopup();
}

function selectNumber(num) {
  selectedNumber = num;
  document.getElementById("selectedNumber").textContent = num;
  openNumberPopup();
}

function placeColorBet() {
  const amount = parseFloat(document.getElementById("colorBetAmount").value);
  if (!isNaN(amount) && amount > 0 && amount <= walletBalance) {
    const effectiveAmount = amount * 0.98;
    walletBalance -= amount;
    updateWalletDisplay();
    addToHistory(`Color: ${selectedColor}`, amount, effectiveAmount);
    closePopup();
  }
}

function placeNumberBet() {
  const amount = parseFloat(document.getElementById("numberBetAmount").value);
  if (!isNaN(amount) && amount > 0 && amount <= walletBalance) {
    const effectiveAmount = amount * 0.98;
    walletBalance -= amount;
    updateWalletDisplay();
    addToHistory(`Number: ${selectedNumber}`, amount, effectiveAmount);
    closePopup();
  }
}

function addToHistory(type, bet, net) {
  const li = document.createElement("li");
  li.textContent = `Bet on ${type}, Amount: ₹${bet}, Net: ₹${net.toFixed(2)}`;
  document.getElementById("historyList").appendChild(li);
  document.getElementById("resultsList").appendChild(li.cloneNode(true));
}

function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

function openHowToPlay() {
  document.getElementById("howToPlayPopup").classList.remove("hidden");
}
