"use client";
import { useState } from "react";
import axios from "axios";

interface Slide {
  title: string;
  content: string;
}

export default function HomePage() {
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("professional");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [typedSlides, setTypedSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateDeck = async () => {
    if (!idea || !industry) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/generate-deck", {
        idea,
        industry,
        tone,
      });
      setSlides(res.data.slides);
      typeSlides(res.data.slides);
    } catch (error) {
      console.error("Error generating deck:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/download-deck",
        { slides },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pitch_deck.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  function typeSlides(slides: Slide[]) {
    setTypedSlides(slides.map(s => ({ title: s.title, content: "" })));
    slides.forEach((slide, i) => {
      let idx = 0;
      function typeChar() {
        setTypedSlides(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            content: slide.content.slice(0, idx + 1)
          };
          return updated;
        });
        if (idx < slide.content.length - 1) {
          setTimeout(typeChar, 15); // speed of typing
          idx++;
        }
      }
      setTimeout(typeChar, i * 400); // delay between slides
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center mb-10 mt-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Pitch Deck Generator
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                Startup Idea
              </label>
              <input
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                placeholder="What's your revolutionary idea?"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                Industry
              </label>
              <input
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                placeholder="Which industry are you disrupting?"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                Tone
              </label>
              <select
                className="w-full px-4 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>

            <button
              onClick={generateDeck}
              disabled={isLoading || !idea || !industry}
              className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] ${
                isLoading || !idea || !industry
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Deck"
              )}
            </button>
          </div>
        </div>

        {slides.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-blue-600">✨</span>
              Generated Slides
            </h2>
            <div className="space-y-6">
              {typedSlides.map((slide, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/50 border border-gray-200 rounded-xl hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-blue-600">•</span>
                    {slide.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {slide.content}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={downloadPDF}
              className="mt-6 w-full py-4 px-6 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all"
            >
              Download as PDF
            </button>
            <button
              onClick={() => {
                setSlides([]);
                setTypedSlides([]);
                setIdea("");
                setIndustry("");
                setTone("professional");
              }}
              className="mt-3 w-full py-4 px-6 bg-white text-blue-600 font-medium rounded-xl border border-blue-600 transition-all hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
