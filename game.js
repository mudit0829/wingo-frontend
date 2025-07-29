let wallet = 1000;
let roundId = 1;
let history = [];
let interval;
let currentResult = null;
let timeLeft = 30;

function startGameLoop() {
  interval = setInterval(() => {
    if (timeLeft > 0) {
      document.getElementById("timer").innerText = timeLeft;
      timeLeft--;
    } else {
      drawResult();
      setTimeout(() => {
        roundId++;
        timeLeft = 30;
        document.getElementById("roundId").innerText = roundId;
        document.getElementById("result").innerText = "Waiting...";
        document.getElementById("betAmount").value = "";
        document.getElementById("betNumber").value = "";
      }, 2000);
    }
  }, 1000);
}

function drawResult() {
  const colorOptions = ["red", "green", "violet"];
  const resultColor = colorOptions[Math.floor(Math.random() * 3)];
  const resultNumber = Math.floor(Math.random() * 10);
  currentResult = { color: resultColor, number: resultNumber };

  document.getElementById("result").innerText = `${resultColor.toUpperCase()}-${resultNumber}`;

  // Check bet outcome
  checkWin(currentResult);

  // Add to history
  history.unshift(`${roundId}: ${resultColor}-${resultNumber}`);
  updateHistory();
}

function placeBet() {
  const amount = parseInt(document.getElementById("betAmount").value);
  const color = document.getElementById("betColor").value;
  const number = parseInt(document.getElementById("betNumber").value);

  if (isNaN(amount) || amount < 10 || amount > wallet) {
    alert("Invalid bet amount");
    return;
  }

  wallet -= amount;
  document.getElementById("wallet").innerText = wallet;

  const bet = {
    roundId,
    amount,
    color,
    number,
    walletBefore: wallet + amount,
  };

  localStorage.setItem("lastBet", JSON.stringify(bet));
  alert("Bet placed!");
}

function checkWin(result) {
  const bet = JSON.parse(localStorage.getItem("lastBet"));
  if (!bet || bet.roundId !== roundId) return;

  let winAmount = 0;
  const effectiveAmount = bet.amount * 0.98;

  if (bet.color === result.color) {
    if (result.color === "violet") winAmount += effectiveAmount * 4.5;
    else winAmount += effectiveAmount * 2;
  }

  if (bet.number === result.number) {
    winAmount += effectiveAmount * 9;
  }

  if (winAmount > 0) {
    alert(`You won Rs. ${Math.round(winAmount)}`);
    wallet += Math.round(winAmount);
    document.getElementById("wallet").innerText = wallet;
  } else {
    alert("You lost the bet");
  }

  localStorage.removeItem("lastBet");
}

function updateHistory() {
  const historyList = document.getElementById("history");
  historyList.innerHTML = "";
  history.slice(0, 10).forEach((item) => {
    const li = document.createElement("li");
    li.innerText = item;
    historyList.appendChild(li);
  });
}

window.onload = () => {
  document.getElementById("roundId").innerText = roundId;
  startGameLoop();
};
