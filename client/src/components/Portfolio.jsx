import { useEffect, useState } from "react";
import { fetchStatus } from "../api";

export default function Portfolio({ user }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchStatus(user)
      .then((res) => {
        setStatus(res.data);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch portfolio data.");
        console.error("❌ Portfolio fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="p-4 font-montserrat">🔄 Loading portfolio...</p>;
  if (error) return <p className="p-4 text-red-500 font-montserrat">{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md font-montserrat text-gray-800">
      <h2 className="text-2xl font-bold mb-2">👤 User: {user}</h2>

      <div className="space-y-1 text-sm">
        <p>💵 <strong>INR Balance:</strong> ${status.inr.toFixed(2)}</p>
        <p>📈 <strong>Total PnL:</strong> ${status.pnl}</p>
        <p>📊 <strong>Unrealized PnL:</strong> ${status.unrealizedPNL}</p>
        <p>💰 <strong>Realized PnL:</strong> ${status.realizedPNL}</p>
      </div>

      <h3 className="mt-4 font-semibold text-lg">📦 Holdings</h3>
      {Object.entries(status.holdings).filter(([_, h]) => h.quantity > 0).length === 0 ? (
        <p className="text-sm text-gray-500 mt-1">No active holdings.</p>
      ) : (
        <ul className="mt-2 text-sm list-disc list-inside space-y-1">
          {Object.entries(status.holdings).map(([symbol, { quantity, costBasis }]) =>
            quantity > 0 ? (
              <li key={symbol}>
                {symbol}: {quantity.toFixed(4)} units @ Cost: ${costBasis}
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}
