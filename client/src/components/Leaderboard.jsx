import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then((res) => setData(res.data.leaderboard || []));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300 bg-white rounded-md shadow-sm">
        <thead className="bg-indigo-50 text-gray-700 uppercase text-sm font-semibold">
          <tr>
            <th className="p-3 border">#</th>
            <th className="p-3 border text-left">Username</th>
            <th className="p-3 border text-right">Total PnL</th>
            <th className="p-3 border text-right">Unrealized</th>
            <th className="p-3 border text-right">Realized</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No leaderboard data available.
              </td>
            </tr>
          ) : (
            data.map((user, idx) => (
              <tr key={user.name} className="hover:bg-gray-50">
                <td className="p-3 border text-center font-medium">{idx + 1}</td>
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border text-right">₹{user.pnl.toFixed(2)}</td>
                <td className="p-3 border text-right">₹{user.unrealizedPNL?.toFixed(2) || 0}</td>
                <td className="p-3 border text-right">₹{user.realizedPNL?.toFixed(2) || 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
