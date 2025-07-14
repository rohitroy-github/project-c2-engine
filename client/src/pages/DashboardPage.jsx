import { useEffect } from "react";
import { useAuthContext } from "../context/authContext";
import { fetchStatus } from "../api";

export default function DashboardPage() {
  const { userInfo, refreshUserInfo } = useAuthContext();

  useEffect(() => {
    if (userInfo?.username) {
      refreshUserInfo(userInfo.username);
    }
  }, [userInfo?.username]);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-montserrat">
        <p className="text-lg">🔐 Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-montserrat">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">
          📊 Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-100 p-4 rounded">
            <p className="text-gray-600 text-sm">Username</p>
            <p className="text-lg font-semibold">{userInfo.username}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <p className="text-gray-600 text-sm">USD Balance</p>
            <p className="text-lg font-semibold">${userInfo.usd.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <p className="text-gray-600 text-sm">Realized PnL</p>
            <p className="text-lg font-semibold text-yellow-700">
              ${userInfo.realizedPNL.toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-gray-600 text-sm">Unrealized PnL</p>
            <p className="text-lg font-semibold text-blue-700">
              ${userInfo.unrealizedPNL.toFixed(2)}
            </p>
          </div>
          <div className="bg-indigo-100 p-4 rounded sm:col-span-2">
            <p className="text-gray-600 text-sm">Total PnL</p>
            <p className="text-2xl font-bold text-indigo-700">
              ${(userInfo.pnl || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📦 Holdings
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-2 border">Symbol</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Cost Basis</th>
              </tr>
            </thead>
            <tbody>
              {/* {Object.entries(userInfo.holdings).map(([symbol, data]) =>
                data.quantity > 0 ? (
                  <tr key={symbol}>
                    <td className="p-2 border">{symbol}</td>
                    <td className="p-2 border">{data.quantity.toFixed(4)}</td>
                    <td className="p-2 border">${data.costBasis.toFixed(2)}</td>
                  </tr>
                ) : null
              )} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
