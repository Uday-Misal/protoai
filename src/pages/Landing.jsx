// Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FooterSection from '../components/FooterSection';

const Landing = () => {
  const featuresData = {
    items: [
      "Easy Expense Tracking",
      "Visual Reports & Charts",
      "Budget Management",
      "Category Organization",
    ]
  };

  const testimonialsData = {
    items: [
      "This app changed how I manage my finances!",
      "Simple, intuitive, and powerful.",
      "Finally, budgeting made easy!"
    ]
  };

  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <FeatureSection data={featuresData} />
        <TestimonialsSection data={testimonialsData} />
        <FooterSection />
      </main>
    </div>
  );
};

export default Landing;