document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("bet-popup");
  const popupAmount = document.getElementById("bet-amount");
  const popupType = document.getElementById("bet-type");
  const confirmBtn = document.getElementById("confirm-bet");
  const cancelBtn = document.getElementById("cancel-bet");
  const popupRound = document.getElementById("popup-round");

  const roundDisplay = document.getElementById("round-number");
  const timerDisplay = document.getElementById("timer");

  let currentRound = 1001;
  let countdown = 25;

  const updateTimer = () => {
    timerDisplay.textContent = countdown + "s";
    if (countdown === 0) {
      currentRound++;
      countdown = 25;
      roundDisplay.textContent = currentRound;
      generateResult();
    } else {
      countdown--;
    }
  };
  setInterval(updateTimer, 1000);

  roundDisplay.textContent = currentRound;

  let selectedBet = null;
  document.querySelectorAll(".color-button, .number-button").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedBet = btn.textContent;
      popupRound.textContent = currentRound;
      popupType.innerHTML = `
        <option value="${selectedBet}">${selectedBet}</option>
        <option value="x2">x2</option>
        <option value="x5">x5</option>
        <option value="x10">x10</option>
        <option value="x50">x50</option>
        <option value="x100">x100</option>
      `;
      popup.style.display = "block";
    });
  });

  cancelBtn.addEventListener("click", () => {
    popup.style.display = "none";
    selectedBet = null;
  });

  confirmBtn.addEventListener("click", () => {
    const amount = popupAmount.value;
    const type = popupType.value;
    if (amount && selectedBet) {
      addToHistory(currentRound, selectedBet, amount, type);
      popup.style.display = "none";
      popupAmount.value = "";
      selectedBet = null;
    }
  });

  function addToHistory(round, bet, amount, type) {
    const historyTable = document.querySelector("#game-history tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${round}</td>
      <td>${bet}</td>
      <td>${amount}</td>
      <td>${type}</td>
    `;
    historyTable.prepend(row);
  }

  function generateResult() {
    const results = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const result = results[Math.floor(Math.random() * results.length)];

    let color = "";
    if (["1", "3", "7", "9"].includes(result)) color = "Green";
    else if (["2", "4", "6", "8"].includes(result)) color = "Red";
    else if (["0", "5"].includes(result)) color = "Violet";

    const table = document.querySelector("#recent-results tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${currentRound}</td>
      <td class="result-${color.toLowerCase()}">${color}</td>
      <td>${result}</td>
    `;
    table.prepend(row);
  }
});
