import { useState } from "react";
import CreateUserForm from "./components/CreateUserForm";
import TradePanel from "./components/TradePanel";
import Portfolio from "./components/Portfolio";
import Leaderboard from "./components/Leaderboard";
import LivePriceChart from './components/LivePriceChart'; 

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState("");

  return (
    <div className="max-w-4xl mx-auto mt-10 font-montserrat">
      <CreateUserForm />
      <div className="p-4">
        <input
          placeholder="Enter username to trade"
          className="border p-2 mr-2 cursor-pointer font-montserrat"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
        />
      </div>
      {/* {currentUser && (
        <>
          <TradePanel user={currentUser} />
          <Portfolio user={currentUser} />
        </>
      )} */}

      {currentUser && (
        <>
          <TradePanel user={currentUser} />
          <Portfolio user={currentUser} />

          {/* 📈 Live Price Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <LivePriceChart symbol="ETH_SUB1" />
            {/* <LivePriceChart symbol="ETH_SUB2" />
            <LivePriceChart symbol="ETH_SUB3" /> */}
          </div>
        </>
      )}

      <Leaderboard />
    </div>
  );
}

export default App;
