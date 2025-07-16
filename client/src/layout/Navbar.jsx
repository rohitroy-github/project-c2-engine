import { Link } from "react-router-dom";
import { useAuthContext } from "../context/authContext";

export default function Navbar() {
  const { userInfo, updateAuth } = useAuthContext();
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between font-montserrat">
      <div className="flex gap-6 text-gray-800 font-semibold text-sm md:text-base">
        {!userInfo?.username && <Link to="/register" className="hover:text-purple-600 transition">
          Register
        </Link>}
        {!userInfo?.username && <Link to="/login" className="hover:text-purple-600 transition">
          Login
        </Link>}
        {userInfo?.username && <Link to="/trade" className="hover:text-purple-600 transition">
          Trade
        </Link>}
        <Link to="/leaderboard" className="hover:text-purple-600 transition">
          Leaderboard
        </Link>
        {userInfo?.username && <Link to="/dashboard" className="hover:text-purple-600 transition">
          Dashboard
        </Link>}
      </div>
      <div className="flex items-center gap-4">
        {userInfo?.username && (
          <div className="flex items-center justify-end gap-3 bg-indigo-600 text-white font-bold px-4 py-2 rounded-md shadow-md">
            <span>{userInfo.username}</span>
            <span>₹{userInfo.inr.toFixed(2)} INR</span>
          </div>
        )}
        {userInfo?.username && (
          <button className="flex items-center justify-end gap-3 bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded-md shadow-md cursor-pointer" onClick={() => {
            updateAuth(null);
          }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
