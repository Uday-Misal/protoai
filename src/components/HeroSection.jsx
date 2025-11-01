import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <header className="bg-indigo-600 text-white py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Transform Ideas Into Reality with AI
        </h1>
        <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
          ProtoAI helps developers and entrepreneurs turn project ideas into 
          detailed blueprints using artificial intelligence.
        </p>
        <div className="space-x-4">
          <Link
            to="/signup"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
