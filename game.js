let selectedBet = null;
let roundNumber = 1001;
let wallet = 1000;
let timer = 25;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("wallet").textContent = wallet;
  document.getElementById("roundNumber").textContent = roundNumber;

  setInterval(() => {
    timer = (timer - 1 + 30) % 30;
    document.getElementById("timer").textContent = timer;
  }, 1000);
});

function openColorPopup(color) {
  selectedBet = { type: "color", value: color };
  document.getElementById("betInfo").textContent = `Placing Bet For: ${color}`;
  document.getElementById("popup").classList.remove("hidden");
}

function openNumberPopup(number) {
  selectedBet = { type: "number", value: number };
  document.getElementById("betInfo").textContent = `Placing Bet For: Number ${number}`;
  document.getElementById("popup").classList.remove("hidden");
}

function placeBet(amount) {
  if (wallet < amount) {
    alert("Insufficient balance!");
    return;
  }
  wallet -= amount;
  document.getElementById("wallet").textContent = wallet;
  alert(`Bet placed on ${selectedBet.value} with ₹${amount}`);
  closePopup();
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function deposit() {
  wallet += 500;
  document.getElementById("wallet").textContent = wallet;
}

function withdraw() {
  if (wallet >= 500) {
    wallet -= 500;
    document.getElementById("wallet").textContent = wallet;
  } else {
    alert("Not enough balance to withdraw!");
  }
}

function showTab(tab) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}
