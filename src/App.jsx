/* --------------------------------------------------------
 * Core Backend Service
 * Domain: Engineering and Technology
 * Focus: Applied Mathematics and Artificial Intelligence
 * Field: Computer and Data Science
 * Created by: MOHAMED HATEM MOHAMED ABDELAZIZ MOHAMED 
 *           & EBRAHIM MOHAMED EBRAHIM HAMADA RASAD
 * -------------------------------------------------------- */

import { GoogleGenAI } from "@google/genai";
import { useState, useEffect } from "react";
import { IoSparkles } from "react-icons/io5";
import {
  HiClipboard,
  HiExclamationCircle,
  HiPencilAlt,
  HiCheck,
  HiVolumeUp,
  HiStop,
  HiUsers,
  HiArrowLeft,
} from "react-icons/hi";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTeamPage, setShowTeamPage] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const countWords = (str) => {
    return str
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const countSentences = (str) => {
    return str
      .trim()
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0).length;
  };

  const pluralize = (count, singular, plural) => {
    return count === 1 ? singular : plural;
  };

  const pasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setError(null);
    } catch (error) {
      console.error("Failed to paste: ", error);
      setError("Failed to paste text. You can try pasting it manually.");
    }
  };

  const summarizeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    if (text.trim().length < 50) {
      setError(
        "Text is too short to summarize. Please enter at least 50 characters."
      );
      return;
    }

    handleStopSpeech();

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents:
          "Please provide a concise, one-sentence summary of the following text:\n\n" +
          text,
      });

      if (response && response.text) {
        setSummary(response.text);
      } else {
        throw new Error("No response text received from Gemini.");
      }
    } catch (err) {
      console.error("Summarization failed: ", err);
      setError(err.message || "An error occurred while summarizing the text.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy: ", error);
      setError("Failed to copy to clipboard. Please try again.");
    }
  };

  const handleSpeak = () => {
    if (!summary) return;

    if (isSpeaking) {
      handleStopSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = ""; 

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("SpeechSynthesisUtterance error", event);
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const clearAll = () => {
    handleStopSpeech();
    setText("");
    setSummary("");
    setError(null);
    setCopied(false);
  };

  if (showTeamPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-2xl max-w-3xl w-full p-8 rounded-2xl border border-purple-200">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2">
              <HiUsers className="text-purple-600" /> The Ingenium Core Team
            </h1>
            <div className="bg-purple-900 p-5 rounded-xl max-w-md mx-auto text-left border border-purple-950 shadow-inner">
              <div className="flex items-center gap-2 text-purple-200 font-bold mb-3">
                <span className="text-base">🌐</span> Project Technical Foundation:
              </div>
              <ul className="list-disc list-inside text-sm text-purple-100 font-semibold space-y-2 pl-2">
                <li>Engineering and Technology</li>
                <li>Applied Mathematics and Artificial Intelligence</li>
                <li>Computer and Data Science</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 my-8">
            <div className="p-5 bg-base-100 shadow-md border-l-4 border-purple-600 rounded-r-xl border border-base-200">
              <h2 className="font-bold text-purple-600 text-lg">MOHAMED HATEM MOHAMED ABDELAZIZ MOHAMED</h2>
              <p className="text-sm text-base-content/70 mt-1">Systems Architecture & Backend Security Core</p>
            </div>
            
            <div className="p-5 bg-base-100 shadow-md border-l-4 border-blue-600 rounded-r-xl border border-base-200">
              <h2 className="font-bold text-blue-600 text-lg">EBRAHIM MOHAMED EBRAHIM HAMADA RASAD</h2>
              <p className="text-sm text-base-content/70 mt-1">User Interface Integration & API Data Handlers</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <button 
              onClick={() => setShowTeamPage(false)} 
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors btn btn-ghost btn-sm"
            >
              <HiArrowLeft className="w-4 h-4" /> Back to Summarizer App
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      data-theme="light"
      className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <IoSparkles className="text-purple-600 hidden sm:block" /> AI Text Summarizer
          </h1>
          <p className="text-xl text-base-content/70 font-medium">
            Powered by Google Gemini AI
          </p>
        </div>
        <div className="card bg-base-100 shadow-2xl max-w-5xl mx-auto">
          <div className="card-body p-8">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <label className="text-lg font-semibold">
                  📝 Enter your text
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="tooltip"
                    data-tip={`${text.length} characters`}
                  >
                    <div className="badge badge-sm sm:badge-lg badge-ghost gap-2">
                      {countWords(text)}{" "}
                      {pluralize(countWords(text), "word", "words")} •{" "}
                      {countSentences(text)}{" "}
                      {pluralize(countSentences(text), "sentence", "sentences")}
                    </div>
                  </div>
                  <button
                    onClick={pasteText}
                    className="btn btn-sm btn-primary gap-2"
                    disabled={loading}
                  >
                    <HiClipboard className="w-4 h-4" />
                    Paste
                  </button>
                </div>
              </div>
              <textarea
                className="textarea textarea-primary w-full h-56 text-base"
                placeholder="Paste your article, blog post, or any long text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
            {error && (
              <div className="alert alert-error mb-6">
                <HiExclamationCircle className="w-6 h-6" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex justify-end gap-3 mb-6">
              <button
                className="btn btn-secondary"
                onClick={clearAll}
                disabled={loading}
              >
                Clear
              </button>
              <button
                className="btn btn-primary"
                onClick={summarizeText}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Summarizing...
                  </>
                ) : (
                  <>
                    <HiPencilAlt className="w-5 h-5" />
                    Summarize
                  </>
                )}
              </button>
            </div>
            {summary && <div className="divider"></div>}
            {summary && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">✅ Summary</h2>
                    <div
                      className="tooltip"
                      data-tip={`${summary.length} characters`}
                    >
                      <div className="badge badge-sm sm:badge-lg badge-ghost gap-2">
                        {countWords(summary)}{" "}
                        {pluralize(countWords(summary), "word", "words")} •{" "}
                        {countSentences(summary)}{" "}
                        {pluralize(
                          countSentences(summary),
                          "sentence",
                          "sentences"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleSpeak}
                      className={`btn btn-sm sm:btn-md gap-2 flex-1 sm:flex-initial ${
                        isSpeaking ? "btn-warning" : "btn-neutral"
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <HiStop className="w-5 h-5" /> Stop Voice
                        </>
                      ) : (
                        <>
                          <HiVolumeUp className="w-5 h-5" /> Read Aloud
                        </>
                      )}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="btn btn-sm sm:btn-md btn-success gap-2 flex-1 sm:flex-initial"
                    >
                      {copied ? (
                        <>
                          <HiCheck className="w-5 h-5" /> Copied!
                        </>
                      ) : (
                        <>
                          <HiClipboard className="w-5 h-5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="alert alert-success">
                  <div className="text-lg w-full leading-relaxed whitespace-pre-wrap text-left">
                    {summary}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-10 flex flex-col items-center gap-4">
          <p className="text-base-content/60 font-medium">
            © 2026 The Ingenium Core Team. All Rights Reserved.
          </p>
          <button 
            onClick={() => setShowTeamPage(true)}
            className="btn btn-outline btn-primary gap-2 btn-sm sm:btn-md shadow-md hover:scale-105 transition-transform"
          >
            <HiUsers className="w-5 h-5" />
            View Project Team
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
