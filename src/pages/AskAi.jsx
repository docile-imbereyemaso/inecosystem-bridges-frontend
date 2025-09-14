import React, { useState, useEffect } from "react";
import { API_KEY } from "../lib/API";
import jsPDF from "jspdf";
import image from '/images/logo.png';
import { Link } from "react-router";

const NavTop = ({ darkMode, setDarkMode }) => {
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
          <div className="flex space-x-6 items-center">
            <h3 className="text-gray-100">AI Career Roadmap Generator</h3>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="ml-4 px-3 py-1 rounded-lg bg-white/20 text-white font-semibold shadow hover:bg-indigo-700 transition"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
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
  const [darkMode, setDarkMode] = useState(() => {
    // Try to use system preference on first load
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Update <html> class for Tailwind dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
  - pattern for YouTube links: {"skill": "Skill Name", "link": "https://www.youtube.com/results?search_query=Skill+Name+tutorial"}
  - Practical experience suggestions
- Additionally, recommend 2-3 TVET schools in Rwanda where a student could go to learn these skills. Include:
  - name
  - location
  - relevant programs

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
    "Month 2": {
      "mainFocus": "Object-Oriented Programming",
      "skillsToLearn": ["Classes", "Inheritance", "Polymorphism"],
      "learningResources": ["PHP OOP Guide", "Object-Oriented Programming in PHP by Matt Zandstra"],
      "youtubeLinks": {
        "Classes": { "skill": "Classes", "link": "https://www.youtube.com/results?search_query=PHP+Classes+tutorial" }
      },
      "practicalExperience": ["Create a small application using OOP"]
    }
  },
  "tvetSchools": [
    {
      "name": "Nyamata TVET School",
      "location": "Bugesera District",
      "programs": ["Web Development", "Software Engineering"]
    },
    {
      "name": "Musanze TVET School",
      "location": "Musanze District",
      "programs": ["IT and Computer Science", "Software Development"]
    }
  ]
}`;
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
      <div className="max-w-3xl mx-auto p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md min-h-screen shadow-2xl rounded-3xl border border-indigo-100 dark:border-gray-700">
        <NavTop darkMode={darkMode} setDarkMode={setDarkMode} />

        <form
          onSubmit={handleGenerate}
          className="space-y-6 py-4 my-4 bg-white dark:bg-gray-900 rounded-xl shadow-inner px-6"
        >
          {/* Career */}
          <div>
            <label className="block text-sm font-bold text-indigo-700 dark:text-gray-200 tracking-wide">
              Your Career Choice:
            </label>
            <input
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              placeholder="e.g. Data Analyst, Electrician, Nurse"
              className="mt-2 block w-full rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-300 p-3 bg-white/80 shadow-sm transition"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-bold text-indigo-700 dark:text-gray-200 tracking-wide">
              Duration
            </label>
            <div className="flex gap-2 mt-2 items-center">
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="rounded-xl p-2 border border-indigo-200 bg-white/80 shadow-sm"
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
                  className="p-2 border rounded-xl bg-white/80 shadow-sm"
                />
              )}
              <label className="ml-4 inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={youtubeOnly}
                  onChange={(e) => setYoutubeOnly(e.target.checked)}
                  className="mr-2 accent-indigo-600"
                />
                <span className="text-indigo-700 dark:text-gray-200 font-medium">YouTube only</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate"
              )}
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
              className="px-6 py-2 rounded-xl border border-indigo-200 bg-white/80 dark:text-gray-200 font-semibold shadow hover:bg-indigo-50 transition"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-8 p-6 border rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-indigo-700 dark:text-gray-200 flex items-center gap-2">
              <svg className="w-6 h-6 " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Generated Roadmap
            </h3>
            {responseJson && (
              <div className="flex gap-2">

                <button
                  onClick={downloadPDF}
                  className="text-sm px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:scale-105 transition"
                >
                  Download PDF
                </button>
              </div>
            )}
          </div>

          <div className="mt-3">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-indigo-600">
                <svg className="animate-spin h-5 w-5 text-indigo-500" viewBox="0 0 24 24">
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
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Generating roadmap...
              </div>
            )}
            {!loading && !responseJson && (
              <div className="text-sm text-gray-500 italic">
                No response yet. Fill the form and click{" "}
                <span className="font-semibold dark:text-gray-200">Generate</span>.
              </div>
            )}
            {responseJson && (
              <div className="space-y-8">
                <div className="p-5 bg-white rounded-xl shadow flex flex-col gap-1">
                  <h3 className="text-xl font-extrabold text-indigo-800 flex items-center gap-2">
                    
                    Career Roadmap: {responseJson.careerChoice}
                  </h3>
                  <p className="text-sm text-indigo-700 font-medium">
                    Duration: {responseJson.duration}
                  </p>
                </div>
                <div className="space-y-6">

                  {/* TVET School Recommendations */}
                  {responseJson.tvetSchools && responseJson.tvetSchools.length > 0 && (
                    <div className="p-5 border rounded-xl bg-white shadow">
                      <h3 className="text-md font-bold text-indigo-700 mb-2 flex items-center gap-2">
                       
                        Recommended TVET Schools in Rwanda
                      </h3>
                      <p className="mb-2 text-gray-700">The following is a list of TVET schools you can learn from:</p>
                      <ul className="list-inside text-sm text-gray-700">
                        {responseJson.tvetSchools.map((school, i) => (
                          <li key={i} className="mb-2">
                            <p className="font-semibold text-indigo-800">{school.name}</p>
                            <div className="px-3">
                              <p>Location: <span className="text-indigo-700">{school.location}</span></p>
                              <p>
                                Relevant Programs:{" "}
                                <span className="text-indigo-700">{school.programs?.join(", ") || "N/A"}</span>
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Object.entries(responseJson.roadmap || {}).map(
                    ([phase, details], idx) => (
                      <div
                        key={phase}
                        className="border rounded-xl p-5 bg-white shadow"
                      >
                        <h4 className="text-lg font-bold text-indigo-700 mb-2 flex items-center gap-2">
                          <span className="inline-block bg-indigo-200 text-indigo-800 rounded-full px-3 py-1 text-xs font-bold mr-2 shadow">
                            {phase}
                          </span>
                          {details.mainFocus}
                        </h4>

                        <div className="mb-2">
                          <p className="text-sm font-semibold text-gray-700">
                            Skills to Learn:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-700 mb-2 ml-4">
                            {details.skillsToLearn?.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        {details.youtubeLinks && (
                          <div className="mb-2">
                            <p className="text-sm font-semibold text-gray-700">
                              Video Tutorials:
                            </p>
                            <ul className="list-disc list-inside text-sm text-blue-700 mb-2 ml-4">
                              {Object.entries(details.youtubeLinks).map(
                                ([skill, link], i) => (
                                  <li key={i}>
                                    <a
                                      href={link?.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline hover:text-indigo-600 transition"
                                    >
                                      {link?.skill}
                                    </a>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Practical Experience:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                            {details.practicalExperience?.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        </div>
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





