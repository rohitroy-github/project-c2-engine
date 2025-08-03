import { useState } from "react";
import { createUser } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";

export default function RegisterPage() {
  const { updateAuth } = useAuthContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    wallet: "",
    username: "",
    age: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      alert("⚠️ Username is required!");
      return;
    }

    const userPayload = {
      username: form.username,
      name: form.name,
      wallet: form.wallet,
      age: form.age,
    };

    try {
      const response = await createUser(form.username);

      if (response.data?.balance) {
        updateAuth({
          username: form.username,
          inr: response.data.balance.initialInr,
        });

        console.log("📝 Registration data:", userPayload);
        alert("✅ User registered successfully!");

        setForm({
          name: "",
          wallet: "",
          username: "",
          age: "",
        });

        navigate("/trade");
      }
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Unknown error";
      alert("🚫 Error creating user: " + message);
      console.error("❌ Create user error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-montserrat">
      <div className="bg-white shadow-xl p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Let's sign up 📝
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Wallet Address
            </label>
            <input
              type="text"
              name="wallet"
              value={form.wallet}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 font-semibold">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Unique username"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="e.g. 22"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Have an account ?{" "}
          <Link
            to="/login"
            className="text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}
