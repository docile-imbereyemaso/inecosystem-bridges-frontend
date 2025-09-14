import React, { useState } from "react";
import { API_KEY } from "../lib/API";
import jsPDF from "jspdf";
import image from '/images/logo.png';
import { Link } from "react-router";

const NavTop = () => {
  return (
    <nav className="bg-indigo-600 shadow-md rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-1">
        <div className="flex flex-col sm:flex-row justify-between h-16 items-center">
          
          <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
            <img src={image} alt="Logo" className="h-10 w-auto" />
            <h1 className="text-white font-bold text-xl tracking-wide">
              INECOSYSTEM BRIDGE
            </h1>
          </Link>

          <div className="flex space-x-6">
            <h3 className="text-gray-100">AI Career Roadmap Generator</h3>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default function AskAi() {
  const [career, setCareer] = useState("");
  const [duration, setDuration] = useState("6 months");
  const [customDuration, setCustomDuration] = useState("");
  const [youtubeOnly, setYoutubeOnly] = useState(true);
  const [responseJson, setResponseJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function buildPrompt(careerValue, durationValue, youtubeOnlyFlag) {
    return `You are a career roadmap generator AI.
The user will provide:
- A career choice: "${careerValue}"
- A duration: "${durationValue}"

Your task:
- Generate a structured career roadmap in JSON format only.
- Break the roadmap into phases (e.g., Months, Quarters, or Years depending on duration).
- For each phase, include:
  - Main focus
  - Skills to learn
  - Learning resources (articles, platforms, books, etc.)
  - YouTube/video links for each skill (${
    youtubeOnlyFlag
      ? "limit links to YouTube only"
      : "include relevant free video platforms too"
  })
  - pattern for youTube links: {"skill": "Skill Name", "link": "https://www.youtube.com/results?search_query=Skill+Name+tutorial"}
  - Practical experience suggestions

Return ONLY a JSON object, nothing else.
Example of the expected response format:

{
  "careerChoice": "PHP Developer",
  "duration": "6 months",
  "roadmap": {
    "Month 1": {
      "mainFocus": "PHP Fundamentals",
      "skillsToLearn": ["Variables", "Functions", "Arrays"],
      "learningResources": [
        "PHP.net documentation",
        { "name": "Codecademy PHP Course", "url": "https://www.codecademy.com/learn/learn-php" }
      ],
      "youtubeLinks": {
        "Variables": { "skill": "Variables", "link": "https://www.youtube.com/results?search_query=Variables+tutorial" },
        "Functions": { "skill": "Functions", "link": "https://www.youtube.com/results?search_query=Functions+tutorial" }
      },
      "practicalExperience": ["Build a simple calculator", "Create a basic form that processes data"]
    },
    "Month 2": { /* ... */ }
  }
`;
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setError(null);
    setResponseJson(null);

    if (!career.trim()) {
      setError("Please enter a career name.");
      return;
    }

    const dur = duration === "custom" ? customDuration.trim() || null : duration;
    if (!dur) {
      setError("Please specify a duration.");
      return;
    }

    const prompt = buildPrompt(career.trim(), dur, youtubeOnly);

    setLoading(true);
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
          API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();

      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      text = text.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(text);
        console.log(parsed)
      } catch {
        parsed = { error: "AI response was not valid JSON", raw: text };
      }

      setResponseJson(parsed);
    } catch (err) {
      setError(err.message || "Failed to get response.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyJSON() {
    if (!responseJson) return;
    navigator.clipboard.writeText(JSON.stringify(responseJson, null, 2));
  }

  function downloadJSON() {
    if (!responseJson) return;
    const blob = new Blob([JSON.stringify(responseJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(career || "roadmap").replace(/\s+/g, "_")}_roadmap.json`;
    a.click();
    URL.revokeObjectURL(url);
  }


function downloadPDF() {
    if (!responseJson) return;
    const doc = new jsPDF();

    // 🔹 Helper: draw header on each page
    function drawHeader() {
        doc.setTextColor(75, 0, 130);
        doc.setFont("times", "bold");
        doc.setFontSize(18);
        doc.text("INECOSYSTEM BRIDGE", 105, 15, { align: "center" });
        
        // Reset text color + default font for content
        doc.setTextColor(0, 0, 0);
        doc.setFont("times", "normal");
        doc.setFontSize(12);
    }

    // 🔹 Page 1 Header
    drawHeader();

    // Add career roadmap title
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text(`Career Roadmap: ${responseJson.careerChoice}`, 10, 30);

    // Add duration
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Duration: ${responseJson.duration}`, 10, 40);

    let y = 50;

    // Process each phase
    for (const [phase, details] of Object.entries(responseJson.roadmap || {})) {
        doc.setFont("times", "bold");
        doc.setFontSize(13);
        doc.text(`${phase}: ${details.mainFocus}`, 10, y);
        y += 8;

        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.text("Skills to Learn:", 10, y);
        y += 6;

        for (const skill of details.skillsToLearn || []) {
            doc.text(`- ${skill}`, 15, y);
            y += 6;
        }

        if (details.youtubeLinks) {
            doc.text("Video Tutorials:", 10, y);
            y += 6;

            for (const [skill, linkObj] of Object.entries(details.youtubeLinks)) {
                doc.text(`- ${skill}: ${linkObj.link}`, 15, y);
                y += 6;
            }
        }

        doc.text("Practical Experience:", 10, y);
        y += 6;

        for (const exp of details.practicalExperience || []) {
            doc.text(`- ${exp}`, 15, y);
            y += 6;
        }

        y += 6;

        // 🔹 Page Break Handling
        if (y > 270) {
            doc.addPage();
            drawHeader(); // always reset font + header
            y = 30;
        }
    }

    doc.save(`${(career || "roadmap").replace(/\s+/g, "_")}_roadmap.pdf`);
}

  return (
    <div className="min-h-screen bg-[#E4F8E2] dark:bg-gray-900 transition-colors duration-300 pb-10">
        <div className="max-w-3xl mx-auto p-6 bg-white   min-h-screen shadow-md ">
        <NavTop />
    

      <form onSubmit={handleGenerate} className="space-y-4 py-3 my-3">
        {/* Career */}
        <div>
          <label className="block text-sm font-bold text-gray-700">
            Your Career Choice: 
          </label>
          <input
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            placeholder="e.g. Data Analyst, Electrician, Nurse"
            className="mt-1  block w-full rounded-lg border border-gray-300  focus:ring-2 focus:ring-indigo-200 p-2"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-bold text-gray-700">
            Duration
          </label>
          <div className="flex gap-2 mt-2 items-center">
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="rounded-lg p-2 border"
            >
              <option>3 months</option>
              <option>6 months</option>
              <option>1 year</option>
              <option>3 years</option>
              <option value="custom">Custom</option>
            </select>
            {duration === "custom" && (
              <input
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                placeholder="e.g. 9 months"
                className="p-2 border rounded-lg"
              />
            )}
            <label className="ml-4 inline-flex items-center">
              <input
                type="checkbox"
                checked={youtubeOnly}
                onChange={(e) => setYoutubeOnly(e.target.checked)}
                className="mr-2"
              />
              YouTube only
            </label>
          </div>
        </div>

        {/* Buttons */}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          <button
            type="button"
            onClick={() => {
              setCareer("");
              setDuration("6 months");
              setCustomDuration("");
              setResponseJson(null);
              setError(null);
            }}
            className="px-4 py-2 rounded-lg border"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Generated Roadmap</h3>
          {responseJson && (
            <div className="flex gap-2">
              {/* <button
                onClick={handleCopyJSON}
                className="text-sm px-2 py-1 border rounded"
              >
                Copy JSON
              </button>
              <button
                onClick={downloadJSON}
                className="text-sm px-2 py-1 border rounded"
              >
                Download JSON
              </button> */}
              <button
                onClick={downloadPDF}
                className="text-sm px-2 py-1 border rounded bg-indigo-600 text-white"
              >
                Download PDF
              </button>
            </div>
          )}
        </div>

        <div className="mt-3">
          {loading && (
            <div className="text-sm text-gray-600">Generating roadmap...</div>
          )}
          {!loading && !responseJson && (
            <div className="text-sm text-gray-500">
              No response yet. Fill the form and click Generate.
            </div>
          )}
          {responseJson && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800">
                  Career Roadmap: {responseJson.careerChoice}
                </h3>
                <p className="text-sm text-gray-600">
                  Duration: {responseJson.duration}
                </p>
              </div>
              <div className="space-y-4">
                {Object.entries(responseJson.roadmap || {}).map(
                  ([phase, details]) => (
                    <div
                      key={phase}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <h4 className="text-md font-bold text-indigo-700 mb-2">
                        {phase}: {details.mainFocus}
                      </h4>

                      <p className="text-sm font-semibold text-gray-700">
                        Skills to Learn:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                        {details.skillsToLearn?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>

                      {details.youtubeLinks && (
                        <>
                          <p className="text-sm font-semibold text-gray-700">
                            Video Tutorials:
                          </p>
                          <ul className="list-disc list-inside text-sm text-blue-600 mb-2">
                            {Object.entries(details.youtubeLinks).map(
                              ([skill, link], i) => (
                                <li key={i}>
                                  <a
                                    href={link?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {link?.skill}
                                  </a>
                                </li>
                              )
                            )}
                          </ul>
                        </>
                      )}

                      <p className="text-sm font-semibold text-gray-700">
                        Practical Experience:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {details.practicalExperience?.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>

  );
}





