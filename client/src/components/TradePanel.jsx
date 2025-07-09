import { useState } from "react";
import { makeTrade } from "../api";

export default function TradePanel({ user, defaultSymbol = "ETH_SUB1" }) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [side, setSide] = useState("BUY");
  const [amountUSD, setAmountUSD] = useState("");

  const handleTrade = async () => {
    const amount = parseFloat(amountUSD);

    if (!amount || amount <= 0) {
      alert("⚠️ Enter a valid amount greater than 0.");
      return;
    }

    try {
      const res = await makeTrade({
        username: user,
        symbol,
        side,
        amountUSD: amount,
      });

      alert(res.data.message || "✅ Trade successful.");
      setAmountUSD(""); // Clear input
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Unknown error occurred.";
      alert("❌ Trade failed: " + message);
    }
  };

  const toggleSide = () => {
    setSide((prev) => (prev === "BUY" ? "SELL" : "BUY"));
  };

  return (
    <div className="font-montserrat space-y-5">
      {/* Select Asset */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Select Asset</label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="ETH_SUB1">ETH - S1</option>
          <option value="ETH_SUB2">ETH - S2</option>
          <option value="ETH_SUB3">ETH - S3</option>
        </select>
      </div>

      {/* Toggle Side */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Action</label>
        <div
          className={`w-full flex items-center justify-between px-1 py-1 rounded-md cursor-pointer transition-colors ${
            side === "BUY" ? "bg-green-100" : "bg-red-100"
          }`}
          onClick={toggleSide}
        >
          <div
            className={`w-1/2 text-center py-2 rounded-md transition-colors font-semibold ${
              side === "BUY" ? "bg-green-400 text-white" : "text-gray-600"
            }`}
          >
            Buy
          </div>
          <div
            className={`w-1/2 text-center py-2 rounded-md transition-colors font-semibold ${
              side === "SELL" ? "bg-red-400 text-white" : "text-gray-600"
            }`}
          >
            Sell
          </div>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Amount (USD)</label>
        <input
          type="number"
          min={0}
          placeholder="Enter USD amount"
          value={amountUSD}
          onChange={(e) => setAmountUSD(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleTrade}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Execute
      </button>
    </div>
  );
}
