// game.js

// Dummy Wallet for Frontend Testing
let walletBalance = 1000;

function updateWalletDisplay() {
    const walletAmount = document.getElementById('wallet-amount');
    if (walletAmount) walletAmount.textContent = `₹ ${walletBalance}`;
}

function updateTimer() {
    const timerEl = document.getElementById('timer');
    const roundEl = document.getElementById('round-number');
    if (!timerEl || !roundEl) return;

    const now = new Date();
    const seconds = now.getSeconds();
    const remaining = 30 - (seconds % 30);
    const round = Math.floor(now.getTime() / 30000);

    timerEl.textContent = `${remaining}s`;
    roundEl.textContent = `#${round}`;
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Popup Controls
function openPopup(type) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const betType = document.getElementById('bet-type');
    const betInput = document.getElementById('bet-value');
    const amountInput = document.getElementById('bet-amount');

    if (!popup || !popupTitle || !betType) return;

    popup.style.display = 'flex';

    if (type === 'color') {
        popupTitle.textContent = 'Place Color Bet';
        betType.value = 'color';
    } else if (type === 'number') {
        popupTitle.textContent = 'Place Number Bet';
        betType.value = 'number';
    }

    betInput.value = '';
    amountInput.value = '';
}

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';
}

function selectPresetAmount(amount) {
    const amountInput = document.getElementById('bet-amount');
    if (amountInput) amountInput.value = amount;
}

function placeBet() {
    const type = document.getElementById('bet-type').value;
    const value = document.getElementById('bet-value').value.trim();
    const amount = parseInt(document.getElementById('bet-amount').value);

    if (!value || isNaN(amount) || amount <= 0) {
        alert('Enter valid value and amount');
        return;
    }

    if (amount > walletBalance) {
        alert('Insufficient balance');
        return;
    }

    walletBalance -= amount;
    updateWalletDisplay();
    closePopup();
    alert(`Bet Placed on ${type.toUpperCase()}: ${value} (₹${amount})`);
}

function showHowToPlay() {
    const rules = `
    Red (1, 3, 7, 9) → 2x
    Green (0, 2, 4, 6, 8) → 2x
    Violet (0 or 5) → 4.5x
    Number (0–9) → 9x
    `;
    alert(rules);
}

// Dummy Game History
function populateHistory() {
    const historyBody = document.getElementById('game-history');
    const recentBody = document.getElementById('recent-results');
    if (!historyBody || !recentBody) return;

    historyBody.innerHTML = '';
    recentBody.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const round = 1000 - i;
        const result = Math.floor(Math.random() * 10);
        const color = getColor(result);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${round}</td>
            <td>${result}</td>
            <td>${color}</td>
        `;
        historyBody.appendChild(tr);

        const recentTr = document.createElement('tr');
        recentTr.innerHTML = `
            <td>#${round}</td>
            <td>${result}</td>
            <td>${color}</td>
        `;
        recentBody.appendChild(recentTr);
    }
}

function getColor(result) {
    if ([1, 3, 7, 9].includes(result)) return 'Red';
    if ([0, 2, 4, 6, 8].includes(result)) return 'Green';
    if ([0, 5].includes(result)) return 'Violet';
    return '-';
}

document.addEventListener('DOMContentLoaded', () => {
    updateWalletDisplay();
    updateTimer();
    setInterval(updateTimer, 1000);
    populateHistory();

    document.getElementById('close-popup').addEventListener('click', closePopup);
    document.getElementById('confirm-bet').addEventListener('click', placeBet);

    document.getElementById('open-color-popup').addEventListener('click', () => openPopup('color'));
    document.getElementById('open-number-popup').addEventListener('click', () => openPopup('number'));

    document.getElementById('how-to-play').addEventListener('click', showHowToPlay);

    document.querySelectorAll('[data-section]').forEach(btn => {
        btn.addEventListener('click', () => showSection(btn.dataset.section));
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => selectPresetAmount(btn.dataset.amount));
    });
});
