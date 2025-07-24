const ResultDisplay = ({ result }) => (
  <div>
    <h3>🎯 Round Result</h3>
    <p>Winning Number: {result.result}</p>
    <p>Winning Color: {result.winningColor}</p>
  </div>
);
export default ResultDisplay;