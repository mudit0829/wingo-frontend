const API_BASE = 'https://your-backend-url'; // change this
const TOKEN = 'your_hardcoded_jwt';

let selectedColor = null;
let selectedNumber = null;

async function fetchBalance() {
  const res = await fetch(API_BASE + '/user/balance', {
    headers: { Authorization: 'Bearer ' + TOKEN }
  });
  const data = await res.json();
  document.getElementById('balance').textContent = data.balance;
}

function startTimer(sec=30) {
  const cd = document.getElementById('countdown');
  let t = sec;
  cd.textContent = t;
  const iv = setInterval(() => {
    t--;
    cd.textContent = t;
    if (t <= 0) {
      clearInterval(iv);
      fetchRound();
      startTimer(30);
    }
  }, 1000);
}

async function fetchRound() {
  const res = await fetch(API_BASE + '/round/current');
  const data = await res.json();
  document.getElementById('message').textContent = `Round ${data.roundId} | Result: ${data.resultColor}-${data.resultNumber}`;
}

function renderNumbers() {
  const numDiv = document.getElementById('numbers');
  for (let i = 0; i < 10; i++) {
    const b = document.createElement('button');
    b.textContent = i;
    b.onclick = () => selectedNumber = i;
    numDiv.appendChild(b);
  }
}

document.getElementById('colors').onclick = (e) => {
  if (e.target.dataset.color) {
    selectedColor = e.target.dataset.color;
  }
};

document.getElementById('placeBet').onclick = async () => {
  if (!selectedColor || selectedNumber === null) {
    alert('Choose a color & number first');
    return;
  }
  const res = await fetch(API_BASE + '/bet/place', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      color: selectedColor,
      number: selectedNumber,
      amount: 10
    })
  });
  const rd = await res.json();
  alert('Bet placed: ' + rd.status);
  fetchBalance();
};

window.onload = () => {
  fetchBalance();
  fetchRound();
  startTimer(30);
  renderNumbers();
};
