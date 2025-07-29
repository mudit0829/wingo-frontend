const backendUrl = "https://wingo-backend-nqk5.onrender.com";

let selectedBet = null;

document.querySelectorAll('.color-option, .number').forEach(el => {
  el.addEventListener('click', () => {
    selectedBet = el.dataset.color || el.dataset.number;
    document.getElementById('bet-choice').textContent = `Selected: ${selectedBet}`;
    document.getElementById('betModal').style.display = 'block';
  });
});

document.getElementById('closeModal').onclick = () => {
  document.getElementById('betModal').style.display = 'none';
};

document.getElementById('confirmBet').onclick = async () => {
  const amount = parseFloat(document.getElementById('betAmount').value);
  const token = localStorage.getItem('token');

  if (!amount || amount <= 0) return alert("Enter valid amount");
  if (!selectedBet) return alert("No selection made");

  try {
    const response = await fetch(`${backendUrl}/api/bets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        color: ['Red', 'Green', 'Violet'].includes(selectedBet) ? selectedBet : null,
        number: !isNaN(selectedBet) ? Number(selectedBet) : null,
        amount
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alert("Bet placed successfully!");
    document.getElementById('betModal').style.display = 'none';
    updateWallet();
  } catch (err) {
    alert("Error: " + err.message);
  }
};

async function updateWallet() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const res = await fetch(`${backendUrl}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById('wallet').textContent = data.wallet.toFixed(2);
}

// Timer logic (placeholder)
let timeLeft = 25;
const timerEl = document.getElementById('timer');
setInterval(() => {
  timeLeft--;
  if (timeLeft < 0) timeLeft = 25;
  timerEl.textContent = timeLeft.toString().padStart(2, '0');
}, 1000);

updateWallet();
