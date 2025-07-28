document.addEventListener("DOMContentLoaded", () => {
  let selectedBetType = null;

  const popup = document.getElementById("bet-popup");
  const betTypeText = document.getElementById("bet-type");
  const betAmount = document.getElementById("bet-amount");
  const placeBetBtn = document.getElementById("place-bet-btn");
  const cancelBetBtn = document.getElementById("cancel-bet-btn");
  const walletSpan = document.getElementById("wallet-balance");
  const resultsTable = document.getElementById("results-table");
  const historyTable = document.getElementById("history-table");

  // Mock user data
  let wallet = 1000;
  let roundId = 101;

  function updateWalletDisplay() {
    walletSpan.textContent = wallet.toFixed(2);
  }

  function openBetPopup(type) {
    selectedBetType = type;
    popup.classList.remove("hidden");
    betTypeText.textContent = `You selected: ${type}`;
    betAmount.value = "";
  }

  function closeBetPopup() {
    popup.classList.add("hidden");
  }

  function addResultRow(round, number, color, time) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${round}</td>
      <td>${number}</td>
      <td style="color:${color.toLowerCase()}">${color}</td>
      <td>${time}</td>
    `;
    resultsTable.prepend(row);
  }

  function addHistoryRow(round, colorBet, numberBet, multiplier, profit) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${round}</td>
      <td>${colorBet || "-"}</td>
      <td>${numberBet || "-"}</td>
      <td>${multiplier}x</td>
      <td>${profit >= 0 ? "₹" + profit.toFixed(2) : "-₹" + Math.abs(profit).toFixed(2)}</td>
    `;
    historyTable.prepend(row);
  }

  document.querySelectorAll(".bet-button").forEach(btn => {
    btn.addEventListener("click", () => {
      openBetPopup(btn.dataset.color);
    });
  });

  document.querySelectorAll(".number-button").forEach(btn => {
    btn.addEventListener("click", () => {
      openBetPopup(`Number ${btn.dataset.number}`);
    });
  });

  placeBetBtn.addEventListener("click", () => {
    const amount = parseFloat(betAmount.value);
    if (isNaN(amount) || amount <= 0) return alert("Enter valid amount");

    // 2% service fee
    const fee = amount * 0.02;
    const effective = amount - fee;

    wallet -= amount;
    updateWalletDisplay();

    // Mock result and multiplier
    const multiplier = [2, 4.5, 9][Math.floor(Math.random() * 3)];
    const profit = effective * multiplier;

    addHistoryRow(roundId, selectedBetType.includes("Number") ? null : selectedBetType, selectedBetType.includes("Number") ? selectedBetType : null, multiplier, profit - amount);
    closeBetPopup();
  });

  cancelBetBtn.addEventListener("click", () => {
    closeBetPopup();
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    alert("Logged out");
    // Redirect if needed
  });

  function startTimer(duration) {
    const timerDisplay = document.getElementById("timer");
    let timeLeft = duration;
    timerDisplay.textContent = timeLeft;

    const interval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(interval);
        roundId++;
        document.getElementById("round-id").textContent = roundId;
        startTimer(25); // restart for new round

        // mock result
        const resNum = Math.floor(Math.random() * 10);
        const resColor = resNum === 5 ? "Violet" : [1,3,7,9].includes(resNum) ? "Green" : "Red";
        const timestamp = new Date().toLocaleTimeString();

        addResultRow(roundId - 1, resNum, resColor, timestamp);
      }
    }, 1000);
  }

  document.getElementById("round-id").textContent = roundId;
  updateWalletDisplay();
  startTimer(25);
});
