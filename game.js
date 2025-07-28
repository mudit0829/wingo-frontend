document.addEventListener("DOMContentLoaded", () => {
  const timerEl = document.getElementById("timer");
  const roundEl = document.getElementById("roundNumber");
  const walletEl = document.getElementById("walletAmount");

  function updateTimer() {
    if (timerEl) {
      const seconds = 25 - (Math.floor(Date.now() / 1000) % 30);
      timerEl.textContent = seconds + "s";
    }
  }

  function updateRound() {
    if (roundEl) {
      const totalRounds = 2880;
      const startTime = new Date();
      startTime.setHours(0, 0, 0, 0);
      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 30000);
      roundEl.textContent = (elapsed % totalRounds) + 1;
    }
  }

  function updateWalletDisplay() {
    if (walletEl) {
      walletEl.textContent = "1000";
    }
  }

  updateTimer();
  updateRound();
  updateWalletDisplay();
  setInterval(updateTimer, 1000);
  setInterval(updateRound, 30000);

  // Show/Hide History
  document.getElementById("gameHistoryTab").addEventListener("click", () => {
    document.getElementById("gameHistory").style.display = "block";
    document.getElementById("myHistory").style.display = "none";
  });

  document.getElementById("myHistoryTab").addEventListener("click", () => {
    document.getElementById("myHistory").style.display = "block";
    document.getElementById("gameHistory").style.display = "none";
  });

  // How to Play modal
  const howModal = document.getElementById("howToPlayModal");
  const betModal = document.getElementById("betModal");

  document.getElementById("howToPlayBtn").onclick = () => {
    howModal.style.display = "block";
  };
  document.getElementById("closeModal").onclick = () => {
    howModal.style.display = "none";
  };
  document.getElementById("closeBetModal").onclick = () => {
    betModal.style.display = "none";
  };

  // Color Bet
  document.querySelectorAll(".color-bet").forEach(btn => {
    btn.onclick = () => {
      const color = btn.dataset.color;
      document.getElementById("betTypeText").textContent = `Place Bet on ${color}`;
      betModal.style.display = "block";
    };
  });

  // Number Bet
  document.querySelector(".number-bet").onclick = () => {
    document.getElementById("betTypeText").textContent = `Place Bet on Number`;
    betModal.style.display = "block";
  };
});
