// src/Output.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Output() {
  const navigate = useNavigate();
  const code = localStorage.getItem("generatedCode") || "// No code to run";

  return (
    <div style={{ padding: 20, fontFamily: "Arial", textAlign: "center" }}>
      <h2>✅ Execution Output</h2>
      <div style={{
        background: "#111",
        color: "lime",
        padding: 10,
        borderRadius: 8,
        width: "85%",
        margin: "auto",
        textAlign: "left"
      }}>
        <pre>{`// Simulated run:\n${code}\n\n// (This is a demo. To execute code, integrate a safe sandbox.)`}</pre>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => navigate("/")} style={{ padding: "10px 20px" }}>
          🔙 Back to Home
        </button>
      </div>
    </div>
  );
}
