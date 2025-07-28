document.addEventListener("DOMContentLoaded", () => {
  let selectedType = "";
  let selectedValue = "";

  const popup = document.getElementById("betPopup");
  const overlay = document.getElementById("overlay");
  const betTypeLabel = document.getElementById("betType");
  const placeBetBtn = document.getElementById("placeBetBtn");
  const closePopupBtn = document.getElementById("closePopupBtn");
  const betAmountInput = document.getElementById("betAmount");
  const timerElement = document.getElementById("timer");
  const roundElement = document.getElementById("roundNumber");

  // Dummy values for demo
  let walletBalance = 1000;
  let currentRound = 1234;
  let timer = 25;

  function updateWalletDisplay() {
    const walletInfo = document.getElementById("walletAmount");
    if (walletInfo) walletInfo.textContent = walletBalance.toFixed(2);
  }

  function updateTimer() {
    if (timerElement) timerElement.textContent = `${timer}s`;
    if (roundElement) roundElement.textContent = `#${currentRound}`;
    timer--;

    if (timer < 0) {
      timer = 25;
      currentRound++;
    }
  }

  setInterval(updateTimer, 1000);
  updateWalletDisplay();

  // Show bet popup
  window.openColorPopup = (color) => {
    selectedType = "Color";
    selectedValue = color;
    showPopup();
  };

  window.openNumberPopup = (num) => {
    selectedType = "Number";
    selectedValue = num;
    showPopup();
  };

  function showPopup() {
    popup.style.display = "block";
    overlay.style.display = "block";
    betTypeLabel.textContent = `Placing Bet For: ${selectedType} - ${selectedValue}`;
  }

  function closePopup() {
    popup.style.display = "none";
    overlay.style.display = "none";
    selectedType = "";
    selectedValue = "";
    betAmountInput.value = "";
  }

  placeBetBtn.addEventListener("click", () => {
    const amount = parseFloat(betAmountInput.value);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    alert(`Placed ₹${amount} on ${selectedType} - ${selectedValue}`);
    closePopup();
  });

  closePopupBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);

  // Tab toggling
  window.showTab = (tabId) => {
    document.querySelectorAll(".tab-section").forEach(tab => {
      tab.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");
  };

  // Dummy How to Play content
  document.getElementById("howToPlayContent").textContent = "Select color or number and place bet before timer ends.";
});
