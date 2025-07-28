let walletAmount = 1000;

document.addEventListener("DOMContentLoaded", () => {
  updateWalletDisplay();
  updateTimer();
  setInterval(updateTimer, 1000);
  updateRoundNumber();
  loadRecentResults();
});

function updateWalletDisplay() {
  document.getElementById("wallet-amount").textContent = walletAmount;
}

function deposit() {
  walletAmount += 100;
  updateWalletDisplay();
}

function withdraw() {
  if (walletAmount >= 100) {
    walletAmount -= 100;
    updateWalletDisplay();
  }
}

function updateRoundNumber() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const round = Math.floor((minutes * 60 + now.getSeconds()) / 30);
  document.getElementById("round-number").textContent = round;
}

let secondsLeft = 25;
function updateTimer() {
  document.getElementById("timer").textContent = `${secondsLeft}s`;
  secondsLeft--;
  if (secondsLeft < 0) {
    secondsLeft = 25;
    updateRoundNumber();
  }
}

function loadRecentResults() {
  const results = ["Red 3", "Green 2", "Violet 0", "Number 7", "Red 9"];
  document.getElementById("recent-results").innerHTML = results.map(r => `<div>${r}</div>`).join("");
}

function openColorPopup(color) {
  document.getElementById("selected-color").textContent = color;
  document.getElementById("color-popup").classList.remove("hidden");
}

function openNumberPopup(number) {
  document.getElementById("selected-number").textContent = number;
  document.getElementById("number-popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("color-popup").classList.add("hidden");
  document.getElementById("number-popup").classList.add("hidden");
}

function placeColorBet() {
  const amount = parseInt(document.getElementById("color-bet-amount").value);
  if (!isNaN(amount) && amount > 0 && amount <= walletAmount) {
    walletAmount -= amount;
    updateWalletDisplay();
    alert("Color bet placed!");
    closePopup();
  } else {
    alert("Invalid amount.");
  }
}

function placeNumberBet() {
  const amount = parseInt(document.getElementById("number-bet-amount").value);
  if (!isNaN(amount) && amount > 0 && amount <= walletAmount) {
    walletAmount -= amount;
    updateWalletDisplay();
    alert("Number bet placed!");
    closePopup();
  } else {
    alert("Invalid amount.");
  }
}
