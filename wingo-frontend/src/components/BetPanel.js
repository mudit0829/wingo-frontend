import { useState } from "react";

const colors = ["RED", "GREEN", "VIOLET"];
const numbers = Array.from({ length: 10 }, (_, i) => i);

const BetPanel = ({ onBet }) => {
  const [amount, setAmount] = useState(100);

  return (
    <div>
      <h3>🎨 Color Bets</h3>
      {colors.map((color) => (
        <button key={color} onClick={() => onBet("color", color, amount)}>
          {color}
        </button>
      ))}

      <h3>🔢 Number Bets</h3>
      {numbers.map((n) => (
        <button key={n} onClick={() => onBet("number", String(n), amount)}>
          {n}
        </button>
      ))}

      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          min="10"
        />
        <span> Bet Amount</span>
      </div>
    </div>
  );
};

export default BetPanel;