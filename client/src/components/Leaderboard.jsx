import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then((res) => setData(res.data.leaderboard || []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-xl shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white rounded-lg overflow-hidden text-center">
          <thead className="bg-white/10 backdrop-blur text-white text-sm font-semibold">
            <tr>
              <th className="p-3 border border-white/20 first:rounded-tl-lg">
                Rank
              </th>
              <th className="p-3 border border-white/20">Username</th>
              <th className="p-3 border border-white/20 ">Total PnL</th>
              <th className="p-3 border border-white/20">Unrealized</th>
              <th className="p-3 border border-white/20 last:rounded-tr-lg">
                Realized
              </th>
            </tr>
          </thead>
          <tbody className="rounded-b-lg text-white">
            {data.length > 0 ? (
              data.map((user, idx, arr) => (
                <tr key={user.name} className="hover:bg-white/10">
                  <td
                    className={`p-3 border border-white/20 text-center font-medium ${
                      idx === arr.length - 1 ? "rounded-bl-lg" : ""
                    }`}
                  >
                    {idx + 1}
                  </td>
                  <td className="p-3 border border-white/20">{user.name}</td>
                  <td className="p-3 border border-white/20">
                    ₹{user.pnl.toFixed(2)}
                  </td>
                  <td className="p-3 border border-white/20">
                    ₹{user.unrealizedPNL?.toFixed(2) || 0}
                  </td>
                  <td
                    className={`p-3 border border-white/20 ${
                      idx === arr.length - 1 ? "rounded-br-lg" : ""
                    }`}
                  >
                    ₹{user.realizedPNL?.toFixed(2) || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="p-3 border border-white/20 rounded-bl-lg text-center"
                  colSpan={5}
                >
                  No leaderboard data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
