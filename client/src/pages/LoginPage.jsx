import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";
import { fetchStatus } from "../api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { updateAuth } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("⚠️ Username is required!");
      return;
    }

    try {
      const res = await fetchStatus(username);
      if (res.data?.inr !== undefined) {
        updateAuth({
          username,
          inr: res.data.inr,
          pnl: res.data.pnl,
          realizedPNL: res.data.realizedPNL,
          unrealizedPNL: res.data.unrealizedPNL,
        });

        console.log("✅ Logged in as:", username);
        alert("✅ Login successful!");
        navigate("/trade");
      }
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "User not found.";
      alert("🚫 Login failed: " + message);
      console.error("❌ Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-montserrat">
      <div className="bg-white shadow-xl p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome back 👋
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-semibold">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          New here?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
