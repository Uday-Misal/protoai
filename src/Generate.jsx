import { useState } from "react";
import IdeaForm from "./components/IdeaForm";
import BlueprintCard from "./components/BlueprintCard";

export default function Generate() {
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateBlueprint = async (idea) => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      setBlueprint(data.blueprint);
    } catch (error) {
      console.error("Error generating blueprint:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex flex-col items-center py-12 pt-24">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Generate Your Blueprint</h1>
      <p className="text-gray-600 mb-8">Describe your idea and let AI build the prototype</p>

      <IdeaForm onGenerate={generateBlueprint} />
      {loading && <p className="text-gray-500 mt-6">Generating prototype...</p>}
      {blueprint && <BlueprintCard blueprint={blueprint} />}
    </div>
  );
}
