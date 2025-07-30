document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://wingo-backend-nqk5.onrender.com/api";
  const demoEmail = "user@example.com";

  let selectedColor = null;
  let selectedNumber = null;

  // ✅ Selectors
  const walletAmountEl = document.getElementById("wallet-amount");
  const lastResultEl = document.getElementById("last-result");
  const historyBodyEl = document.getElementById("history-body");
  const popup = document.getElementById("bet-popup");
  const betAmountInput = document.getElementById("bet-amount-input");

  const placeBetBtn = document.getElementById("place-bet-btn");
  const confirmBetBtn = document.getElementById("confirm-bet-btn");
  const cancelBetBtn = document.getElementById("cancel-bet-btn");

  // ✅ Load Wallet
  async function loadWallet() {
    try {
      const res = await fetch(`${BASE_URL}/user/wallet/${demoEmail}`);
      const data = await res.json();
      if (walletAmountEl) {
        walletAmountEl.innerText = data.wallet.toFixed(2);
      }
    } catch (err) {
      console.error("Wallet fetch error", err);
      if (walletAmountEl) walletAmountEl.innerText = "Error";
    }
  }

  // ✅ Load Last Game Result
  async function loadLastResult() {
    try {
      const res = await fetch(`${BASE_URL}/rounds/last`);
      const data = await res.json();
      if (lastResultEl) {
        lastResultEl.innerText = `Color: ${data.color}, Number: ${data.number}`;
      }
    } catch (err) {
      console.error("Result fetch error", err);
      if (lastResultEl) lastResultEl.innerText = "Error loading result.";
    }
  }

  // ✅ Load Game History
  async function loadMyHistory() {
    try {
      const res = await fetch(`${BASE_URL}/bets/user/${demoEmail}`);
      const data = await res.json();
      if (historyBodyEl) {
        historyBodyEl.innerHTML = data.map(bet => `
          <tr>
            <td>${bet.roundId}</td>
            <td>${bet.colorBet}</td>
            <td>${bet.numberBet}</td>
            <td>₹${bet.amount}</td>
            <td>₹${bet.netAmount}</td>
            <td>${new Date(bet.timestamp).toLocaleString()}</td>
          </tr>
        `).join('');
      }
    } catch (err) {
      console.error("History fetch error", err);
      if (historyBodyEl) historyBodyEl.innerHTML = `<tr><td colspan="6">Error loading history.</td></tr>`;
    }
  }

  // ✅ Place Bet
  async function placeBet() {
    const amount = parseFloat(betAmountInput.value);
    if (!selectedColor || selectedNumber === null || isNaN(amount) || amount <= 0) {
      alert("Please choose color, number, and valid amount.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/bets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demoEmail,
          colorBet: selectedColor,
          numberBet: selectedNumber,
          amount: amount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place bet.");

      alert("Bet placed successfully!");
      popup.classList.add("hidden");
      betAmountInput.value = "";
      loadWallet();
      loadMyHistory();
    } catch (err) {
      console.error("Bet error", err);
      alert("Error placing bet.");
    }
  }

  // ✅ Setup color and number selection
  document.querySelectorAll(".color-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedColor = btn.dataset.color;
      document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  document.querySelectorAll(".number-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedNumber = parseInt(btn.dataset.number);
      document.querySelectorAll(".number-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // ✅ Event listeners
  placeBetBtn?.addEventListener("click", () => {
    if (selectedColor === null || selectedNumber === null) {
      alert("Please select color and number first.");
    } else {
      popup.classList.remove("hidden");
    }
  });

  confirmBetBtn?.addEventListener("click", placeBet);
  cancelBetBtn?.addEventListener("click", () => {
    popup.classList.add("hidden");
    betAmountInput.value = "";
  });

  // ✅ Initial Load
  loadWallet();
  loadLastResult();
  loadMyHistory();
});
