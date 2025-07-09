import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./layout/Navbar";
import RegisterPage from "./pages/RegisterPage";
import TradePage from "./pages/TradePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import { useState } from "react";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <Router>
      <Navbar user={userInfo} />
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route
          path="/register"
          element={<RegisterPage setUserInfo={setUserInfo} />}
        />
        <Route
          path="/trade"
          element={<TradePage currentUser={userInfo?.username} />}
        />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
