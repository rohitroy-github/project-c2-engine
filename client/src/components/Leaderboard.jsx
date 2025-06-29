import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api';

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then((res) => setData(res.data.leaderboard));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Total PnL</th>
            <th className="border p-2">Unrealized</th>
            <th className="border p-2">Realized</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.name}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">${user.pnl}</td>
              <td className="border p-2">${user.unrealizedPNL}</td>
              <td className="border p-2">${user.realizedPNL}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
