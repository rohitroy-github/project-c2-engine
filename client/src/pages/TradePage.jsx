import { useState } from "react";
import TradePanel from "../components/TradePanel";
import Portfolio from "../components/Portfolio";
import LivePriceChart from "../components/LivePriceChart";
import { useAuthContext } from "../context/authContext";

const assetOptions = [
  { label: "ETH - S1", value: "ETH_SUB1" },
  { label: "ETH - S2", value: "ETH_SUB2" },
  { label: "ETH - S3", value: "ETH_SUB3" },
];

export default function TradePage() {
  const { userInfo } = useAuthContext();
  const [selectedSymbol, setSelectedSymbol] = useState("ETH_SUB1");

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-montserrat">
        <h2 className="text-xl font-semibold">Please log in or register to access the Trading Panel.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 font-montserrat flex flex-col">
      <div className="container flex-1 w-full flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden min-w-screen-lg mx-auto mb-6 mt-6">
        {/* 📈 Left Side - Chart */}
        <div className="w-full md:w-[75%] p-6 border-r border-gray-200 bg-white flex flex-col">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Select Asset</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {assetOptions.map((asset) => (
                <option key={asset.value} value={asset.value}>
                  {asset.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <LivePriceChart symbol={selectedSymbol} />
          </div>
        </div>

        {/* 💼 Right Side - Trade + Portfolio */}
        <div className="w-full md:w-[25%] p-6 bg-gray-50 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Trade {selectedSymbol}</h2>
            <TradePanel defaultSymbol={selectedSymbol} />
          </div>
          {/* <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Portfolio</h2>
            <Portfolio user={userInfo} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
