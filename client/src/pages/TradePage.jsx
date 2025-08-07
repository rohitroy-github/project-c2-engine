import { useState, useEffect } from "react";
import TradePanel from "../components/TradePanel";
import LivePriceChart from "../components/LivePriceChart";
import { useAuthContext } from "../context/authContext";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from 'react-toastify';

const socket = io("http://localhost:3000");

export default function TradePage() {
  const { userInfo } = useAuthContext();
  const [assetOptions, setAssetOptions] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");


  // Fetch assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get("http://localhost:3000/assets");
        const assets = res.data.assets;

        setAssetOptions(
          assets.map((a) => ({ label: a.symbol, value: a.symbol }))
        );

        if (assets.length > 0) {
          setSelectedSymbol(assets[0].symbol); // default selection
        }
      } catch (err) {
        console.error("Error fetching assets:", err.message);
      }
    };

    fetchAssets();
  }, []);


  useEffect(() => {
    const handlePromptUpdate = ({ symbol, prompt }) => {
      console.log("Received prompt:", symbol, prompt);
      toast.warn(`Market Sentiment ${symbol}: ${prompt}`, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    };

    socket.on('promptUpdate', handlePromptUpdate);

    return () => {
      socket.off('promptUpdate', handlePromptUpdate); // cleanup
    };
  }, []);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-montserrat">
        <h2 className="text-xl font-semibold">
          Please log in or register to access the Trading Panel.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 font-montserrat flex flex-col">
      <div className="container flex-1 w-full flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden min-w-screen-lg mx-auto mb-6 mt-6">
        {/* 📈 Left Side - Chart */}
        <div className="w-full md:w-[75%] p-6 border-r border-gray-200 bg-indigo-50 flex flex-col ">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select Asset
            </label>
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
            {selectedSymbol && <LivePriceChart symbol={selectedSymbol} />}
          </div>
        </div>

        {/* 💼 Right Side - Trade + Portfolio */}
        <div className="w-full md:w-[25%] p-6 bg-gray-50 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Trading Panel
            </h2>
            <TradePanel selectedSymbol={selectedSymbol} />
          </div>
        </div>
      </div>
    </div>
  );
}
