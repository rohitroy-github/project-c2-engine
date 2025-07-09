import Leaderboard from "../components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen w-full bg-gray-100 font-montserrat flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-5xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🏆 Leaderboard</h1>
        <Leaderboard />
      </div>
    </div>
  );
}
