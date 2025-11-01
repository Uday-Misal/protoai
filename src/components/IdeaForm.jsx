import React, { useState } from "react";

function IdeaForm({ onGenerate }) {
  const [idea, setIdea] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idea.trim().length === 0) {
      setError("Please provide a description of your idea.");
      return;
    }
    setError("");
    onGenerate(idea);
  };

  const handleIdeaChange = (e) => {
    setIdea(e.target.value);
    if (error && e.target.value.trim().length >= 500) {
      setError("");
    }
  };

  const characterCount = idea.length;
  const isValid = characterCount >= 0;

  return (
    <div className="w-full max-w-4xl">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-[#e7c6a3]"
      >
        <div className="flex flex-col gap-2">
          <textarea
            className={`w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 text-[#4b3832] resize-none ${
              error 
                ? 'border-red-400 focus:ring-red-300' 
                : isValid 
                  ? 'border-green-400 focus:ring-green-300'
                  : 'border-[#d4a373] focus:ring-[#b07a57]'
            }`}
            placeholder="Describe your website idea in detail...

For example: 'I want to create a tiffin service app for home-cooked meals. The app should have a menu page showing different meal options with prices, a subscription page for weekly/monthly plans, an about us page explaining our story, customer testimonials, a contact page with delivery areas, and a user dashboard for managing orders and payments. The design should be warm and homely, using colors that represent fresh, healthy food. Include features like meal customization, dietary preferences, delivery tracking, and customer reviews.'"
            value={idea}
            onChange={handleIdeaChange}
          />
          
          <div className="flex justify-between items-center text-sm">
            <span className={`${
              characterCount === 0 
                ? 'text-gray-500' 
                : 'text-green-600'
            }`}>
              {characterCount} characters {characterCount > 0 ? '✓' : ''}
            </span>
            
            {error && (
              <span className="text-red-500 font-medium">{error}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`self-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
            isValid
              ? 'bg-[#b07a57] text-white hover:bg-[#8c5e3c] cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Generate Blueprint
        </button>
      </form>
    </div>
  );
}

export default IdeaForm;
