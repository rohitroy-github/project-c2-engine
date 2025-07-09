import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { AuthProvider } from "./context/authContext";

function App() {
  return (

    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/trade" element={<TradePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </AuthProvider>
    </Router>

  );
}

export default App;
