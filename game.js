const API_BASE = "https://wingo-backend-nqk5.onrender.com";
const userEmail = "user@example.com";

// Load wallet amount
async function loadWallet() {
  try {
    const res = await fetch(`${API_BASE}/api/users/wallet/${userEmail}`);
    const data = await res.json();
    document.getElementById("wallet-amount").innerText = data.wallet.toFixed(2);
  } catch (err) {
    console.error("Wallet fetch error", err);
    document.getElementById("wallet-amount").innerText = "Error";
  }
}

// Load last round result
async function loadLastResult() {
  try {
    const res = await fetch(`${API_BASE}/api/rounds`);
    const rounds = await res.json();
    const latest = rounds[rounds.length - 1];
    document.getElementById("recent-result").innerText = `Result: ${latest.result} | Round: ${latest.roundId}`;
  } catch (err) {
    console.error("Result fetch error", err);
    document.getElementById("recent-result").innerText = "Error loading result";
  }
}

// Load bet history
async function loadMyHistory() {
  try {
    const res = await fetch(`${API_BASE}/api/bets/user/${userEmail}`);
    const bets = await res.json();
    const container = document.getElementById("my-history");
    container.innerHTML = "";
    bets.slice().reverse().forEach((bet) => {
      const div = document.createElement("div");
      div.className = "history-entry";
      div.innerText = `Round ${bet.roundId} | Color: ${bet.colorBet || '-'} | Number: ${bet.numberBet ?? '-'} | ₹${bet.amount}`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("History fetch error", err);
    document.getElementById("my-history").innerText = "Unable to load history";
  }
}

// Place Bet
async function placeBet() {
  const color = document.querySelector('input[name="color"]:checked')?.value;
  const number = document.querySelector("#number").value;
  const amount = parseFloat(document.querySelector("#amount").value);

  if (!color && number === "") {
    alert("Select at least color or number");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        colorBet: color || null,
        numberBet: number !== "" ? parseInt(number) : null,
        amount,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to place bet");
    }

    alert("Bet placed successfully!");
    closeModal();
    loadWallet();
    loadMyHistory();
  } catch (err) {
    alert("Error: " + err.message);
    console.error("Place bet error", err);
  }
}

// Show modal
function openModal() {
  document.getElementById("bet-modal").style.display = "block";
}

// Close modal
function closeModal() {
  document.getElementById("bet-modal").style.display = "none";
  document.getElementById("bet-form").reset();
}

// Event listeners
document.getElementById("placeBetBtn").addEventListener("click", placeBet);
document.getElementById("openModalBtn").addEventListener("click", openModal);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);

// Initial loads
loadWallet();
loadLastResult();
loadMyHistory();
