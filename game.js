const API="https://wingo-backend-nqk5.onrender.com/api";
const TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1MjY0MTUyYTI1ZjQwNGI4YzU5N2QiLCJpYXQiOjE3NTM3ODA0NTd9.TZfHqzweHCK42Dii3gHFwn7FoQf0sIqRJjpMm-3SdbA";

let chosen = null;

async function fetchWallet() {
  const res = await fetch(`${API}/users/me`, { headers: {Authorization:`Bearer ${TOKEN}`} });
  if(res.ok){
    const {wallet}=await res.json();
    document.getElementById("wallet").innerText=`Wallet: ₹${wallet}`;
  }
}

async function fetchRound() {
  const res = await fetch(`${API}/rounds/current`);
  if(res.ok){
    const data = await res.json();
    document.getElementById("roundId").innerText = data.roundId;
    updateTimer(data.timestamp);
    document.getElementById("lastResult").innerText = data.result || 'Pending';
    updateHistory([data]); // for demo, only current
  }
}

function updateTimer(ts){
  let left = Math.max(0, 30 - Math.floor((Date.now() - new Date(ts))/1000));
  const timer = document.getElementById("timer");
  timer.innerText = left;
  setTimeout(fetchRound, (left+1)*1000+500);
}

function updateHistory(arr){
  const ul = document.getElementById("historyList");
  ul.innerHTML = arr.map(r=>`<li>Round ${r.roundId}: ${r.result||'-'}</li>`).join('');
}

document.querySelectorAll('.choice-btn').forEach(b=>{
  b.onclick = ()=> {
    chosen = b.dataset.choice;
    document.getElementById("selectedChoice").innerText = chosen;
  };
});

document.getElementById("placeBetBtn").onclick =()=>{
  const base = parseInt(document.getElementById("baseAmount").value);
  const mult = parseInt(document.getElementById("multiplier").value);
  if(!chosen) return alert("Select Red/Green/Violet or number");
  const total = base * mult;
  document.getElementById("popupText").innerText =
    `Your Bet: ${chosen} × ₹${base} ×${mult} = ₹${total}`;
  document.getElementById("popup").classList.remove("hidden");
};

document.getElementById("confirmBetBtn").onclick = async()=>{
  const base=parseInt(document.getElementById("baseAmount").value);
  const mult=parseInt(document.getElementById("multiplier").value);
  const amount = base*mult;
  const r = await fetch(`${API}/rounds/current`);
  const {roundId} = await r.json();
  const payload = { roundId, amount };
  if(!isNaN(Number(chosen))) payload.number = Number(chosen);
  else payload.color = chosen;
  const res = await fetch(`${API}/bets`, {
    method:'POST',
    headers: {'Content-Type':'application/json', Authorization:`Bearer ${TOKEN}`},
    body: JSON.stringify(payload)
  });
  if(res.ok){
    alert("Bet placed for ₹"+amount);
    fetchWallet();
    closePopup();
  } else {
    const err = (await res.json()).error || "Bet failed";
    alert(err);
  }
};

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

window.onload = ()=>{
  fetchWallet();
  fetchRound();
};
