document.addEventListener("DOMContentLoaded", () => {
  const walletSpan = document.getElementById("wallet-amount");
  const popup = document.querySelector(".popup");
  const popupTitle = document.getElementById("popup-title");
  const confirmBet = document.getElementById("confirm-bet");
  const cancelBet = document.getElementById("cancel-bet");
  let selectedBet = {};

  // Dummy wallet
  let wallet = 1000;
  walletSpan.innerText = wallet.toFixed(2);

  // Tab click (color/number)
  document.querySelectorAll(".tab, .number-tab").forEach((el) => {
    el.addEventListener("click", () => {
      selectedBet = {
        type: el.classList.contains("number-tab") ? "number" : "color",
        value: el.innerText.trim(),
      };
      popupTitle.innerText = `Place Bet on ${selectedBet.value}`;
      popup.style.display = "flex";
    });
  });

  // Confirm Bet
  confirmBet.addEventListener("click", () => {
    const amount = parseInt(
      document.querySelector('input[name="amount"]:checked')?.value || "0"
    );
    if (wallet >= amount && amount > 0) {
      wallet -= amount;
      walletSpan.innerText = wallet.toFixed(2);
      addToHistory(selectedBet.value, amount);
      popup.style.display = "none";
    } else {
      alert("Invalid Amount or Insufficient Balance");
    }
  });

  // Cancel popup
  cancelBet.addEventListener("click", () => {
    popup.style.display = "none";
  });

  function addToHistory(betValue, amount) {
    const table = document.getElementById("game-history-body");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>#${Math.floor(Math.random() * 1000)}</td>
      <td>${betValue}</td>
      <td>${amount}</td>
    `;
    table.prepend(row);
  }

  // Timer
  const timerSpan = document.getElementById("timer");
  let timeLeft = 25;
  setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      timeLeft = 30;
    }
    timerSpan.innerText = timeLeft + "s";
  }, 1000);
});
