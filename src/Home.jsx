import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">ProtoAI</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Turn your idea into a live web prototype instantly — powered by AI 🚀
      </p>

      <Link
        to="/generate"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
      >
        Generate My Website
      </Link>

      <div className="mt-16 max-w-2xl text-gray-700">
        <h2 className="text-2xl font-semibold mb-2">What Our Users Say</h2>
        <p>✨ "So easy to use!" — Startup Founder</p>
        <p>🚀 "Built my idea in minutes." — Product Designer</p>
      </div>
    </div>
  );
}
