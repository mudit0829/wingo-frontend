import React, { useEffect, useState } from "react";
import axios from "axios";
import Timer from "./components/Timer";
import BetPanel from "./components/BetPanel";
import ResultDisplay from "./components/ResultDisplay";
import Balance from "./components/Balance";

const API_BASE = process.env.REACT_APP_API_URL;

function App() {
  const [roundId, setRoundId] = useState("");
  const [timer, setTimer] = useState(25);
  const [balance, setBalance] = useState(1000);
  const [result, setResult] = useState(null);
  const userId = "replace_with_real_user_id";

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      axios.post(`${API_BASE}/cron/generate-result`, { roundId }).then((res) => {
        setResult(res.data.round);
        setTimeout(() => startNewRound(), 5000);
      });
    }
  }, [timer]);

  const startNewRound = async () => {
    const res = await axios.post(`${API_BASE}/cron/start-timer`);
    setRoundId(res.data.round.roundId);
    setResult(null);
    setTimer(25);
  };

  const handleBet = async (type, value, amount) => {
    await axios.post(`${API_BASE}/bets`, {
      userId,
      roundId,
      type,
      value,
      amount
    });
    alert("Bet placed!");
    setBalance((b) => b - amount);
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>🎮 WinGo Game Demo</h1>
      <Balance amount={balance} />
      <Timer time={timer} />
      <BetPanel onBet={handleBet} />
      {result && <ResultDisplay result={result} />}
    </div>
  );
}

export default App;