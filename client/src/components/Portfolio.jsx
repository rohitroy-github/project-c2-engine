import { useEffect, useState } from 'react';
import { fetchStatus } from '../api';

export default function Portfolio({ user }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchStatus(user).then((res) => setStatus(res.data));
  }, [user]);

  if (!status) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">User: {user}</h2>
      <p>USD Balance: ${status.usd.toFixed(2)}</p>
      <p>Total PnL: ${status.pnl}</p>
      <p>Unrealized PnL: ${status.unrealizedPNL}</p>
      <p>Realized PnL: ${status.realizedPNL}</p>
      <h3 className="mt-4 font-semibold">Holdings:</h3>
      <ul>
        {Object.entries(status.holdings).map(([symbol, { quantity, costBasis }]) =>
          quantity > 0 ? (
            <li key={symbol}>
              {symbol}: {quantity.toFixed(4)} @ Cost: ${costBasis}
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}
