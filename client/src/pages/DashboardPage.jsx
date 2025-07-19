import { useEffect } from "react";
import { useAuthContext } from "../context/authContext";
import { FiRefreshCw } from "react-icons/fi";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-6 font-montserrat">
      <div className="max-w-4xl mx-auto p-8 rounded-xl shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 relative">
        {/* Refresh Button */}
        <button
          onClick={() => refreshUserInfo(userInfo.username)}
          className="absolute top-9 right-9 text-white hover:text-indigo-200 transition-all cursor-pointer"
          title="Refresh"
        >
          <FiRefreshCw size={24} />
        </button>

        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-lg text-white">
            <p className="text-sm text-gray-100">Username</p>
            <p className="text-lg font-semibold">{userInfo?.username}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-lg text-white">
            <p className="text-sm text-gray-100">INR Balance</p>
            <p className="text-lg font-semibold">
              ₹{(userInfo.inr || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-lg text-white">
            <p className="text-sm text-gray-100">Realized PnL</p>
            <p className="text-lg font-semibold text-white">
              ₹{(userInfo.realizedPNL || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-lg text-white">
            <p className="text-sm text-gray-100">Unrealized PnL</p>
            <p className="text-lg font-semibold text-white">
              ₹{(userInfo?.unrealizedPNL || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-lg text-white sm:col-span-2">
            <p className="text-sm text-gray-100">Total PnL</p>
            <p className="text-2xl font-bold text-white">
              ₹{(userInfo.pnl || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">
          Current Holdings
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white rounded-lg overflow-hidden">
            <thead className="bg-white/10 rounded-t-lg text-left">
              <tr>
                <th className="p-3 border border-white/20 first:rounded-tl-lg last:rounded-tr-lg">
                  Symbol
                </th>
                <th className="p-3 border border-white/20">Quantity</th>
                <th className="p-3 border border-white/20">Cost Basis</th>
              </tr>
            </thead>
            <tbody className="rounded-b-lg">
              {userInfo?.holdings &&
              Object.entries(userInfo.holdings).length > 0 ? (
                Object.entries(userInfo.holdings).map(
                  ([symbol, data], idx, arr) =>
                    data.quantity > 0 ? (
                      <tr key={symbol}>
                        <td
                          className={`p-3 border border-white/20 ${
                            idx === arr.length - 1 ? "rounded-bl-lg" : ""
                          }`}
                        >
                          {symbol}
                        </td>
                        <td className="p-3 border border-white/20">
                          {data.quantity.toFixed(4)}
                        </td>
                        <td
                          className={`p-3 border border-white/20 ${
                            idx === arr.length - 1 ? "rounded-br-lg" : ""
                          }`}
                        >
                          ₹{data.costBasis.toFixed(2)}
                        </td>
                      </tr>
                    ) : null
                )
              ) : (
                <tr>
                  <td className="p-2 border border-white/20 rounded-bl-lg">
                    0
                  </td>
                  <td className="p-2 border border-white/20">0</td>
                  <td className="p-2 border border-white/20 rounded-br-lg">
                    0
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
