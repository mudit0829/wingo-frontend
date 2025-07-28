document.addEventListener("DOMContentLoaded", () => {
  const walletAmount = document.getElementById("wallet-amount");
  let userWallet = 1000;
  walletAmount.textContent = userWallet;

  const timerElement = document.getElementById("timer");
  let timeLeft = 25;
  setInterval(() => {
    timerElement.textContent = timeLeft + "s";
    timeLeft = timeLeft <= 0 ? 25 : timeLeft - 1;
  }, 1000);

  const betButton = document.querySelector(".bet-btn");
  const popup = document.getElementById("bet-popup");
  const popupAmount = document.getElementById("bet-amount");
  const placeBetButton = document.getElementById("place-bet");

  let selectedBet = null;

  document.querySelectorAll(".color-buttons button, .number-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedBet = btn.getAttribute("data-bet");
      popup.style.display = "flex";
    });
  });

  placeBetButton.addEventListener("click", () => {
    const amount = parseInt(popupAmount.value);
    if (!amount || amount > userWallet || amount < 1) {
      alert("Invalid amount");
      return;
    }
    userWallet -= amount;
    walletAmount.textContent = userWallet;
    popup.style.display = "none";
    popupAmount.value = "";

    const history = document.getElementById("game-history");
    const row = history.insertRow(1);
    const betType = isNaN(selectedBet) ? selectedBet.toUpperCase() : "Number " + selectedBet;
    row.innerHTML = `<td>${betType}</td><td>₹${amount}</td><td>Pending</td>`;
  });

  window.onclick = function(e) {
    if (e.target === popup) {
      popup.style.display = "none";
      popupAmount.value = "";
    }
  };

  // Dummy Recent Results
  const results = [
    { round: 1021, result: 3 },
    { round: 1020, result: 5 },
    { round: 1019, result: 8 },
    { round: 1018, result: 0 },
    { round: 1017, result: 1 }
  ];

  const resultTable = document.getElementById("recent-results");
  results.forEach(r => {
    const row = resultTable.insertRow(-1);
    const color = r.result === 5 || r.result === 0 ? "violet" :
                  [1, 3, 7, 9].includes(r.result) ? "green" : "red";
    row.innerHTML = `
      <td>${r.round}</td>
      <td class="result-cell ${color}">${r.result}</td>
    `;
  });
});
