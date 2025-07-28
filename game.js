
const backendURL = "https://wingo-backend-nqk5.onrender.com";
let token = "";

async function getToken() {
  const response = await fetch(`${backendURL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test2@example.com", password: "123456" })
  });
  const data = await response.json();
  token = data.token;
}

async function fetchCurrentRound() {
  const res = await fetch(`${backendURL}/api/rounds/latest`);
  const data = await res.json();
  document.getElementById("round-id").innerText = data.roundId || "Unknown";
}

function placeBet() {
  const amount = parseFloat(document.getElementById("bet-amount").value);
  const color = document.getElementById("color-choice").value;
  const number = document.getElementById("number-choice").value;

  if (!amount || amount < 1) {
    alert("Enter valid amount");
    return;
  }

  const payload = {
    roundId: document.getElementById("round-id").innerText,
    amount,
    color,
    number: number !== "" ? parseInt(number) : null,
  };

  fetch(`${backendURL}/api/bets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("message").innerText = "Bet placed!";
    })
    .catch(err => {
      document.getElementById("message").innerText = "Error placing bet.";
    });
}

function startTimer(seconds) {
  let counter = seconds;
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    counter--;
    timerElement.innerText = counter;
    if (counter <= 0) clearInterval(interval);
  }, 1000);
}

window.onload = async () => {
  await getToken();
  await fetchCurrentRound();
  startTimer(30);
};
