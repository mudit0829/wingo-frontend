document.addEventListener("DOMContentLoaded", () => {
  const colorBtns = document.querySelectorAll(".color-btn");
  const numberBtns = document.querySelectorAll(".number-btn");
  const popup = document.getElementById("popup");
  const popupClose = document.getElementById("popup-close");
  const confirmBet = document.getElementById("confirm-bet");
  const betAmountInput = document.getElementById("bet-amount");
  const historyBody = document.getElementById("history-body");

  let selectedBet = null;
  let roundNumber = 1001;

  // Show popup when color or number clicked
  [...colorBtns, ...numberBtns].forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedBet = {
        value: btn.innerText,
        type: btn.classList.contains("color-btn") ? "Color" : "Number",
      };
      popup.classList.remove("hidden");
    });
  });

  // Close popup
  popupClose.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  // Confirm Bet
  confirmBet.addEventListener("click", () => {
    const amount = parseInt(betAmountInput.value);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    addToHistory(roundNumber, amount, selectedBet);
    popup.classList.add("hidden");
    betAmountInput.value = "";
  });

  function addToHistory(round, amount, bet) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>#${round}</td>
      <td>₹${amount}</td>
      <td>${bet.type}: ${bet.value}</td>
      <td>--</td>
      <td>Pending</td>
    `;
    historyBody.prepend(row);
  }

  // Recent Results - Simulated
  const recentResults = [2, 5, 0, 8, 1];
  const recentList = document.getElementById("recent-results-list");
  recentResults.forEach((num) => {
    const li = document.createElement("li");
    li.innerText = `Round ${roundNumber++}: Result ${num}`;
    recentList.appendChild(li);
  });

  // Simulate timer
  let timerSec = 25;
  setInterval(() => {
    timerSec--;
    if (timerSec < 0) {
      timerSec = 25;
      roundNumber++;
      document.getElementById("round-number").innerText = `Round #${roundNumber}`;
    }
    document.getElementById("timer").innerText = `00:${timerSec.toString().padStart(2, "0")}`;
  }, 1000);
});
