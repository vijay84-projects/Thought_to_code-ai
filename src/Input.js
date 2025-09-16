import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Input() {
  const [idea, setIdea] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setIdea(spokenText);
    };

    recognition.start();
  };

  const handleGenerate = async () => {
    if (!idea.trim()) {
      alert("Please enter or speak an idea first.");
      return;
    }

    try {
      setLoading(true);

       const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, language: "javascript" }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded with ${res.status}: ${text}`);
      }

      const data = await res.json();

      // Save generated code & explanation
      localStorage.setItem("generatedCode", data.code);
      localStorage.setItem("generatedExplanation", data.explanation || "");
      navigate("/code");
    } catch (err) {
      console.error("❌ Request failed:", err);
      alert(
        "Failed to generate code.\n\n" +
          "Make sure:\n1️⃣ Backend is running on http://localhost:4000\n2️⃣ No VPN/firewall is blocking requests\n\nDetails: " +
          err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", textAlign: "center" }}>
      <h2>🎤 Voice-to-Code Input</h2>
      <p>Speak or type your idea below</p>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Your idea will appear here..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          style={{ padding: 8, width: 320 }}
        />
        <button
          onClick={startListening}
          style={{
            padding: 8,
            marginLeft: 10,
            backgroundColor: listening ? "red" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          {listening ? "Listening..." : "🎤 Speak"}
        </button>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ padding: 8, marginLeft: 10 }}
        >
          {loading ? "Generating…" : "Generate Code"}
        </button>

        <button
          onClick={() => setIdea("")}
          style={{
            padding: 8,
            marginLeft: 10,
            backgroundColor: "#6c757d",
            color: "white",
            borderRadius: 6,
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
