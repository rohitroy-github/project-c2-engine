import { Link } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { FaUser, FaChartBar, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { userInfo, updateAuth } = useAuthContext();
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between font-montserrat">
      <div className="flex gap-6 text-gray-800 font-semibold text-sm md:text-base">
        {!userInfo?.username && (
          <Link to="/register" className="hover:text-purple-600 transition">
            Register
          </Link>
        )}
        {!userInfo?.username && (
          <Link to="/login" className="hover:text-purple-600 transition">
            Login
          </Link>
        )}
        {userInfo?.username && (
          <Link to="/trade" className="hover:text-purple-600 transition">
            Trade
          </Link>
        )}
        <Link to="/leaderboard" className="hover:text-purple-600 transition">
          Leaderboard
        </Link>
        {userInfo?.username && (
          <Link to="/dashboard" className="hover:text-purple-600 transition">
            Dashboard
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {userInfo?.username && (
          <div className="flex items-center justify-end gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-all duration-200">
            {/* <span>{userInfo.username}</span> */}
            <span>Funds:</span>
            <span>{userInfo.inr.toFixed(2)} INR</span>
          </div>
        )}
        {userInfo?.username && (
          <div className="relative group">
            <button className="px-4 py-2 flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200">
              <FaUser /> {userInfo.username}
            </button>

            <div className="absolute right-0 w-40 mt-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md hidden group-hover:block z-10">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white font-bold transition"
              >
                <FaChartBar className="text-white" />
                Dashboard
              </Link>
              <button
                onClick={() => updateAuth(null)}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white font-bold transition cursor-pointer"
              >
                <FaSignOutAlt className="text-white" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
