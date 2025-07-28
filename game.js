function openPopup(id) {
  document.getElementById(id).style.display = "block";
}

function closePopup(id) {
  document.getElementById(id).style.display = "none";
}

function showHistory() {
  document.getElementById("historySection").classList.remove("hidden");
  document.getElementById("myHistorySection").classList.add("hidden");

  const tbody = document.getElementById("gameHistoryBody");
  tbody.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    tbody.innerHTML += `<tr><td>Red</td><td>${Math.floor(Math.random() * 10)}</td><td>Red</td></tr>`;
  }
}

function showMyHistory() {
  document.getElementById("myHistorySection").classList.remove("hidden");
  document.getElementById("historySection").classList.add("hidden");

  const tbody = document.getElementById("myHistoryBody");
  tbody.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    tbody.innerHTML += `<tr><td>#${1000 + i}</td><td>${new Date().toLocaleString()}</td><td>${i % 2 === 0 ? 'Win' : 'Lose'}</td><td>${i % 2 === 0 ? '+₹98' : '-₹100'}</td></tr>`;
  }
}
