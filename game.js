let currentRound = 1001;
let timeLeft = 30;
let balance = 1000;

const timerDisplay = document.getElementById("timer");
const roundDisplay = document.getElementById("roundNo");
const walletDisplay = document.getElementById("walletBalance");

const betModal = document.getElementById("betModal");
const modalTitle = document.getElementById("modalTitle");
const amountOptions = document.querySelectorAll(".amount-option");
const multiplierOptions = document.querySelectorAll(".multiplier-option");
const placeBetBtn = document.getElementById("placeBetBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

let selectedBetType = null;
let selectedAmount = 1;
let selectedMultiplier = 1;

// ======== Timer Logic =========
function updateTimer() {
  timeLeft--;
  if (timeLeft < 0) {
    currentRound++;
    roundDisplay.textContent = `Round #${currentRound}`;
    timeLeft = 30;
    injectGameHistory(); // Add new result
  }
  timerDisplay.textContent = `${timeLeft < 10 ? "0" : ""}${timeLeft}s`;
}

setInterval(updateTimer, 1000);

// ======== Wallet Display ========
function updateWalletDisplay() {
  walletDisplay.textContent = `₹${balance}`;
}
updateWalletDisplay();

// ======== Open Bet Modal =========
function openBetModal(type) {
  selectedBetType = type;
  modalTitle.textContent = `Placing Bet on ${type}`;
  selectedAmount = 1;
  selectedMultiplier = 1;
  amountOptions.forEach(opt => opt.classList.remove("selected"));
  multiplierOptions.forEach(opt => opt.classList.remove("selected"));
  amountOptions[0].classList.add("selected");
  multiplierOptions[0].classList.add("selected");
  betModal.style.display = "block";
}

// ======== Handle Amount Selection ========
amountOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    amountOptions.forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    selectedAmount = parseInt(opt.getAttribute("data-value"));
  });
});

// ======== Handle Multiplier Selection ========
multiplierOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    multiplierOptions.forEach(o => o.classList.remove("selected"));
    opt.classList.add("selected");
    selectedMultiplier = parseInt(opt.getAttribute("data-multiplier"));
  });
});

// ======== Place Bet ========
placeBetBtn.addEventListener("click", () => {
  const totalBet = selectedAmount * selectedMultiplier;
  if (totalBet > balance) {
    alert("Insufficient Balance");
    return;
  }

  balance -= totalBet;
  updateWalletDisplay();
  addMyHistory(currentRound, selectedBetType, totalBet, "-");

  betModal.style.display = "none";
});

// ======== Close Modal ========
closeModalBtn.addEventListener("click", () => {
  betModal.style.display = "none";
});

// ======== Dummy Game History ========
const gameHistoryTable = document.getElementById("gameHistoryTable");

function injectGameHistory() {
  const colors = ["Red", "Green", "Violet"];
  const number = Math.floor(Math.random() * 10);
  const color = number === 0 || number === 5 ? "Violet" : number % 2 === 0 ? "Red" : "Green";

  const row = `
    <tr>
      <td>${currentRound}</td>
      <td>${color}</td>
      <td>${number}</td>
      <td>${color}</td>
    </tr>`;
  gameHistoryTable.innerHTML = row + gameHistoryTable.innerHTML;
}

// ======== Dummy My History ========
const myHistoryTable = document.getElementById("myHistoryTable");

function addMyHistory(round, type, amount, result) {
  const row = `
    <tr>
      <td>${round}</td>
      <td>${type}</td>
      <td>${amount}</td>
      <td>${result}</td>
    </tr>`;
  myHistoryTable.innerHTML = row + myHistoryTable.innerHTML;
}

// ======== Tabs Toggle ========
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.style.display = "none");

    btn.classList.add("active");
    document.getElementById(btn.getAttribute("data-tab")).style.display = "block";
  });
});

// ======== Attach Bet Buttons ========
document.getElementById("colorRed").addEventListener("click", () => openBetModal("Red"));
document.getElementById("colorGreen").addEventListener("click", () => openBetModal("Green"));
document.getElementById("colorViolet").addEventListener("click", () => openBetModal("Violet"));

document.getElementById("numberBtn").addEventListener("click", () => openBetModal("Number"));
