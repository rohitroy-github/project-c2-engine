import { useEffect, useState } from "react";
import { makeTrade, fetchPrices } from "../api";
import { useAuthContext } from "../context/authContext";

export default function TradePanel({ selectedSymbol = "ETH_SUB1" }) {
  const symbol = selectedSymbol;

  const [side, setSide] = useState("BUY");
  const [amountINR, setAmountINR] = useState("");
  const [priceMap, setPriceMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { userInfo, refreshUserInfo } = useAuthContext();

  // Fetch live prices
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const res = await fetchPrices();
        // console.log(res);
        setPriceMap(res.data?.prices || {});
      } catch (err) {
        console.error("Failed to fetch prices:", err.message);
      }
    };

    fetchPriceData();

    const interval = setInterval(fetchPriceData, 1000); // refresh every second
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const amount = parseFloat(amountINR);

    if (!amount || amount <= 0) {
      alert("⚠️ Enter a valid amount greater than 0.");
      setIsSubmitting(false);

      return;
    }

    try {
      const res = await makeTrade({
        username: userInfo.username,
        symbol,
        side,
        amountINR: amount,
      });

      if (res.data.success) {
        alert(res.data.message || "✅ Trade successful.");
        await refreshUserInfo(userInfo.username);
        setAmountINR("");
      } else {
        alert("❌ Trade failed: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Unknown error occurred.";
      alert("❌ Trade failed: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSide = () => {
    setSide((prev) => (prev === "BUY" ? "SELL" : "BUY"));
  };

  const assetPrice = priceMap[symbol] || 0;
  const holdingQty = userInfo?.holdings?.[symbol]?.quantity || 0;
  const requiredMargin = parseFloat(amountINR || 0).toFixed(2);
  const buyingQuantity =
    assetPrice > 0 && amountINR > 0 ? (amountINR / assetPrice).toFixed(4) : "0";

  return (
    <div className="font-montserrat space-y-5">
      {/* ✅ Show the current selected asset */}
      <div className="mb-3">
        <label className="text-sm text-gray-600 mb-1 block">
          Selected Asset
        </label>
        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 font-semibold">
          {symbol}
        </div>
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
        <label className="text-sm text-gray-600 mb-1 block">Amount (INR)</label>
        <input
          type="number"
          min={0}
          placeholder="Enter INR amount"
          value={amountINR}
          onChange={(e) => setAmountINR(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400"
        />

        {/* Buying Quantity Display */}
        <div className="flex justify-between mt-2">
          <span className="font-medium text-gray-700">Quantity</span>
          <span className="text-indigo-700">
            {assetPrice > 0 && amountINR > 0
              ? (amountINR / assetPrice).toFixed(4)
              : "0"}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleTrade}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Execute
      </button>

      {/* 🧾 Trade Info Section */}
      {userInfo && (
        <div className="text-sm mt-2 bg-indigo-50  border-indigo-500 rounded-md p-4 space-y-2 shadow-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Required margin</span>
            <span className="text-indigo-600">₹{requiredMargin}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Available margin:</span>
            <span className="text-indigo-600">₹{userInfo.inr.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Asset price</span>
            <span className="text-indigo-600">₹{assetPrice.toFixed(3)}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium text-gray-700">Position quantity</span>
            <span className="text-indigo-600">{buyingQuantity}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Holding quantity</span>
            <span className="text-indigo-600">
              {holdingQty.toFixed(4)} {symbol}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
