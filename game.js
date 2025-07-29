document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-bet-modal");
  const closeBtn = document.getElementById("close-bet-modal");
  const modal = document.getElementById("bet-modal");
  const betForm = document.getElementById("bet-form");

  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  betForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = document.getElementById("bet-amount").value;
    const type = document.getElementById("bet-type").value;
    const value = document.getElementById("bet-value").value;

    console.log("Placing bet:", {
      amount,
      type,
      value,
    });

    // TODO: Send POST to backend here...

    alert(`Bet placed on ${type} (${value}) with ₹${amount}`);
    modal.style.display = "none";
    betForm.reset();
  });
});
