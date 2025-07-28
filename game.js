document.addEventListener('DOMContentLoaded', () => {
  const timerEl = document.getElementById('timer');
  const roundEl = document.getElementById('roundNumber');
  const popup = document.getElementById('popup');
  const popupTitle = document.getElementById('popupTitle');
  const selectedAmountInput = document.getElementById('selectedAmount');
  const selectedOptionInput = document.getElementById('selectedOption');
  const submitBetBtn = document.getElementById('submitBet');
  const historyBody = document.getElementById('historyBody');

  let round = 1;
  let timer = 25;

  function updateTimer() {
    timerEl.textContent = timer;
    roundEl.textContent = round;
    if (timer > 0) {
      timer--;
    } else {
      timer = 25;
      round++;
      addHistoryRow(round);
    }
  }

  function addHistoryRow(roundNumber) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${roundNumber - 1}</td>
      <td>Red</td>
      <td>5</td>
      <td>x2</td>
    `;
    historyBody.prepend(tr);
  }

  setInterval(updateTimer, 1000);

  // Attach event to color and number buttons
  document.querySelectorAll('.color-btn, .number-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.textContent.trim();
      popupTitle.textContent = `Place bet on ${selected}`;
      selectedOptionInput.value = selected;
      selectedAmountInput.value = '';
      popup.style.display = 'block';
    });
  });

  // Amount selection
  document.querySelectorAll('.amount-options button').forEach(button => {
    button.addEventListener('click', () => {
      selectedAmountInput.value = button.textContent.replace('₹', '');
    });
  });

  // Submit bet (placeholder functionality)
  submitBetBtn.addEventListener('click', () => {
    const option = selectedOptionInput.value;
    const amount = selectedAmountInput.value;
    alert(`Bet placed on ${option} for ₹${amount}`);
    popup.style.display = 'none';
  });

  // Close popup if clicked outside
  window.addEventListener('click', (e) => {
    if (e.target == popup) {
      popup.style.display = 'none';
    }
  });
});
