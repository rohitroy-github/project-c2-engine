import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between font-montserrat">
      
      <div className="flex gap-6 text-gray-800 font-semibold text-sm md:text-base">
        <Link to="/register" className="hover:text-purple-600 transition">
          Register
        </Link>
        <Link to="/trade" className="hover:text-purple-600 transition">
          Trade
        </Link>
        <Link to="/leaderboard" className="hover:text-purple-600 transition">
          Leaderboard
        </Link>
      </div>

      {user?.username && (
        <div className="flex items-center justify-end gap-3 bg-purple-600 text-white font-bold px-4 py-2 rounded-md shadow-md">
          <span>{user.username}</span>
          <span>${user.usd.toFixed(2)} USD</span>
        </div>
      )}
    </nav>
  );
}
