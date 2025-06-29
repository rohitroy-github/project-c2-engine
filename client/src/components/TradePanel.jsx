import { useState } from 'react';
import { makeTrade } from '../api';

export default function TradePanel({ user }) {
  const [symbol, setSymbol] = useState('ETH_SUB1');
  const [side, setSide] = useState('BUY');
  const [amountUSD, setAmountUSD] = useState('');

  const handleTrade = async () => {
    const res = await makeTrade({ username: user, symbol: symbol, side: side, amountUSD: parseFloat(amountUSD) });
    alert(res.data.message);
  };

  return (
    <div className="p-4">
      <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="mr-2 p-2 border">
        <option>ETH_SUB1</option>
        <option>ETH_SUB2</option>
        <option>ETH_SUB3</option>
      </select>
      <select value={side} onChange={(e) => setSide(e.target.value)} className="mr-2 p-2 border">
        <option>BUY</option>
        <option>SELL</option>
      </select>
      <input
        className="p-2 border mr-2"
        type="number"
        placeholder="Amount USD"
        value={amountUSD}
        onChange={(e) => setAmountUSD(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer" onClick={handleTrade}>
        Trade
      </button>
    </div>
  );
}
