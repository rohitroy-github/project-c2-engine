import { useState } from 'react';
import CreateUserForm from './components/CreateUserForm';
import TradePanel from './components/TradePanel';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState('');

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
      {currentUser && (
        <>
          <TradePanel user={currentUser} />
          <Portfolio user={currentUser} />
        </>
      )}
      <Leaderboard />
    </div>
  );
}

export default App;
