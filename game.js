document.addEventListener("DOMContentLoaded", function () {
  // Simulated wallet balance
  let walletBalance = 5000;
  document.getElementById("walletAmount").textContent = `₹${walletBalance}`;

  // Handle withdraw/deposit clicks
  document.getElementById("withdrawBtn").addEventListener("click", function () {
    alert("Withdraw feature coming soon!");
  });
  document.getElementById("depositBtn").addEventListener("click", function () {
    alert("Deposit feature coming soon!");
  });

  // How to play modal
  document.getElementById("howToPlayBtn").addEventListener("click", () => {
    document.getElementById("howToPlayModal").style.display = "block";
  });
  document.getElementById("closeHowToPlay").addEventListener("click", () => {
    document.getElementById("howToPlayModal").style.display = "none";
  });

  // Color bet buttons
  document.querySelectorAll(".color-bet-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      openBetModal(color, "color");
    });
  });

  // Number bet buttons
  document.querySelectorAll(".number-bet-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const number = btn.getAttribute("data-number");
      openBetModal(number, "number");
    });
  });

  // Bet modal controls
  document.querySelectorAll(".amount-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".amount-option").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  document.querySelectorAll(".multiplier-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".multiplier-option").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  document.getElementById("placeBetBtn").addEventListener("click", () => {
    const amount = document.querySelector(".amount-option.selected");
    const multiplier = document.querySelector(".multiplier-option.selected");
    const target = document.getElementById("betTarget").textContent;
    const type = document.getElementById("betType").value;

    if (!amount || !multiplier) {
      alert("Please select amount and multiplier!");
      return;
    }

    const finalAmount = parseInt(amount.getAttribute("data-amount")) * parseInt(multiplier.getAttribute("data-multiplier"));

    if (finalAmount > walletBalance) {
      alert("Insufficient wallet balance!");
      return;
    }

    walletBalance -= finalAmount;
    document.getElementById("walletAmount").textContent = `₹${walletBalance}`;
    alert(`Bet Placed: ${type} ${target}, Amount: ₹${finalAmount}`);

    document.getElementById("betModal").style.display = "none";
  });

  document.getElementById("closeBetModal").addEventListener("click", () => {
    document.getElementById("betModal").style.display = "none";
  });

  // Game History & My History switching
  document.getElementById("gameHistoryTab").addEventListener("click", () => {
    document.getElementById("gameHistorySection").style.display = "block";
    document.getElementById("myHistorySection").style.display = "none";
    document.getElementById("gameHistoryTab").classList.add("active-tab");
    document.getElementById("myHistoryTab").classList.remove("active-tab");
  });

  document.getElementById("myHistoryTab").addEventListener("click", () => {
    document.getElementById("gameHistorySection").style.display = "none";
    document.getElementById("myHistorySection").style.display = "block";
    document.getElementById("gameHistoryTab").classList.remove("active-tab");
    document.getElementById("myHistoryTab").classList.add("active-tab");
  });

  // Simulated game data
  const gameHistoryTable = document.getElementById("gameHistoryTableBody");
  const myHistoryTable = document.getElementById("myHistoryTableBody");

  const sampleColors = ["Red", "Green", "Violet"];
  for (let i = 0; i < 10; i++) {
    const color1 = sampleColors[Math.floor(Math.random() * 3)];
    const number = Math.floor(Math.random() * 10);
    const color2 = sampleColors[Math.floor(Math.random() * 3)];
    gameHistoryTable.innerHTML += `<tr><td>${color1}</td><td>${number}</td><td>${color2}</td></tr>`;

    const winLose = Math.random() > 0.5 ? "+" : "-";
    const amount = Math.floor(Math.random() * 500) + 50;
    const round = 1000 + i;
    const date = new Date().toLocaleString();
    myHistoryTable.innerHTML += `<tr><td>${round}</td><td>${date}</td><td>${winLose}${amount}</td></tr>`;
  }

  // Helper to open bet modal
  function openBetModal(target, type) {
    document.getElementById("betTarget").textContent = target;
    document.getElementById("betType").value = type;
    document.getElementById("betModal").style.display = "block";
    document.querySelectorAll(".amount-option").forEach((b) => b.classList.remove("selected"));
    document.querySelectorAll(".multiplier-option").forEach((b) => b.classList.remove("selected"));
  }
});
