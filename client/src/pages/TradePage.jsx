import { useState } from "react";
import TradePanel from "../components/TradePanel";
import Portfolio from "../components/Portfolio";
import LivePriceChart from "../components/LivePriceChart";

export default function TradePage() {
  const [currentUser, setCurrentUser] = useState("");

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Trading Panel</h1>
      <input
        placeholder="Enter your username"
        className="border p-2 mb-4 w-full"
        value={currentUser}
        onChange={(e) => setCurrentUser(e.target.value)}
      />
      {currentUser && (
        <>
          <TradePanel user={currentUser} />
          <Portfolio user={currentUser} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <LivePriceChart symbol="ETH_SUB1" />
            <LivePriceChart symbol="ETH_SUB2" />
            <LivePriceChart symbol="ETH_SUB3" />
          </div>
        </>
      )}
    </div>
  );
}
