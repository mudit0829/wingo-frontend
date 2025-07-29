const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MjY0MTUyYTI1ZjQwNGI4YzU5N2QiLCJpYXQiOjE3NTM3ODA0NTd9.TZfHqzweHCK42Dii3gHFwn7FoQf0sIqRJjpMm-3SdbA';
let selectedChoice = '';
let selectedAmount = 1;
let selectedMultiplier = 1;

document.querySelectorAll('.bet-button').forEach(button => {
  button.addEventListener('click', () => {
    selectedChoice = button.dataset.choice;
  });
});

document.getElementById('amount-select').addEventListener('change', (e) => {
  selectedAmount = parseInt(e.target.value);
});

document.querySelectorAll('.multiplier-button').forEach(button => {
  button.addEventListener('click', () => {
    selectedMultiplier = parseInt(button.dataset.multiplier);
  });
});

document.getElementById('place-bet').addEventListener('click', async () => {
  const totalBetAmount = selectedAmount * selectedMultiplier;
  if (!selectedChoice || totalBetAmount <= 0) {
    alert('Please select a bet choice and valid amount.');
    return;
  }

  try {
    const roundRes = await fetch('https://wingo-backend-nqk5.onrender.com/api/rounds/current');
    const roundData = await roundRes.json();
    const roundId = roundData.roundId;

    const betPayload = {
      roundId,
      amount: totalBetAmount,
    };

    if (!isNaN(Number(selectedChoice))) {
      betPayload.number = selectedChoice;
    } else {
      betPayload.color = selectedChoice;
    }

    const response = await fetch('https://wingo-backend-nqk5.onrender.com/api/bets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(betPayload)
    });

    const result = await response.json();
    if (response.ok) {
      document.getElementById('bet-info').innerText = `Your bet: ${selectedChoice}, ₹${totalBetAmount}`;
      document.getElementById('bet-popup').classList.remove('hidden');
      fetchWallet();
    } else {
      alert(result.error || 'Failed to place bet.');
    }
  } catch (err) {
    alert('Error placing bet.');
  }
});

function closePopup() {
  document.getElementById('bet-popup').classList.add('hidden');
}

async function fetchWallet() {
  try {
    const res = await fetch('https://wingo-backend-nqk5.onrender.com/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    document.getElementById('wallet').innerText = `Wallet: ₹${data.wallet}`;
  } catch (err) {
    console.error('Wallet fetch error');
  }
}

async function fetchResult() {
  try {
    const res = await fetch('https://wingo-backend-nqk5.onrender.com/api/rounds/current');
    const data = await res.json();
    document.getElementById('result-value').innerText = data.result || 'Pending...';
  } catch (err) {
    console.error('Result fetch error');
  }
}

window.onload = () => {
  fetchWallet();
  fetchResult();
};
