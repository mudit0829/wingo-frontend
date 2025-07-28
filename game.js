document.addEventListener('DOMContentLoaded', () => {
  let roundNumber = 1;
  let timer = 25;
  let countdownInterval;
  const timerDisplay = document.getElementById('timer');
  const roundDisplay = document.getElementById('roundNumber');
  const popup = document.getElementById('betPopup');
  const amountInput = document.getElementById('betAmount');
  const multiplierDisplay = document.getElementById('selectedMultiplier');
  const historyTable = document.getElementById('myGameHistoryBody');
  const recentResultsTable = document.getElementById('recentResultsBody');

  let selectedBet = {};
  let selectedMultiplier = 2;

  function updateTimer() {
    timerDisplay.textContent = `${timer}s`;
    if (timer === 0) {
      clearInterval(countdownInterval);
      setTimeout(() => {
        roundNumber++;
        roundDisplay.textContent = roundNumber;
        timer = 25;
        startTimer();
        generateResult();
      }, 5000);
    } else {
      timer--;
    }
  }

  function startTimer() {
    timerDisplay.textContent = `${timer}s`;
    countdownInterval = setInterval(updateTimer, 1000);
  }

  startTimer();

  // Handle color and number clicks
  document.querySelectorAll('.color-buttons button, .number-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedBet = {
        type: btn.classList.contains('number') ? 'number' : 'color',
        value: btn.textContent
      };
      document.getElementById('betPopup').style.display = 'block';
    });
  });

  document.getElementById('placeBetBtn').addEventListener('click', () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return alert("Enter valid amount");
    
    // Save to history
    const newRow = historyTable.insertRow(0);
    newRow.insertCell(0).textContent = roundNumber;
    newRow.insertCell(1).textContent = selectedBet.type;
    newRow.insertCell(2).textContent = selectedBet.value;
    newRow.insertCell(3).textContent = amount;
    newRow.insertCell(4).textContent = `x${selectedMultiplier}`;

    popup.style.display = 'none';
    amountInput.value = '';
    selectedMultiplier = 2;
    multiplierDisplay.textContent = 'x2';
  });

  document.getElementById('cancelBetBtn').addEventListener('click', () => {
    popup.style.display = 'none';
    amountInput.value = '';
  });

  document.querySelectorAll('.multiplier-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMultiplier = btn.getAttribute('data-multiplier');
      multiplierDisplay.textContent = `x${selectedMultiplier}`;
    });
  });

  function generateResult() {
    const result = Math.floor(Math.random() * 10);
    let color = '';

    if ([1, 3, 7, 9].includes(result)) color = 'green';
    else if ([2, 4, 6, 8].includes(result)) color = 'red';
    else color = 'violet';

    const newRow = recentResultsTable.insertRow(0);
    newRow.insertCell(0).textContent = roundNumber;
    newRow.insertCell(1).textContent = result;
    
    const colorCell = newRow.insertCell(2);
    const div = document.createElement('div');
    div.classList.add('result-color-box', `result-${color}`);
    colorCell.appendChild(div);
  }
});
