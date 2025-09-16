// src/Code.js
import React from "react";
import { useNavigate } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter"; // ✅ default import
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs"; // ✅ hljs theme

export default function Code() {
  const navigate = useNavigate();
  const code = localStorage.getItem("generatedCode") || "// No code generated";
  const explanation = localStorage.getItem("generatedExplanation") || "";

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>🧠 Generated Code</h2>

      {explanation && (
        <p style={{ fontStyle: "italic", color: "#555" }}>{explanation}</p>
      )}

      <div style={{ textAlign: "left", maxWidth: 700, margin: "20px auto" }}>
        <SyntaxHighlighter language="javascript" style={vs2015}>
          {code}
        </SyntaxHighlighter>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/output")}
          style={{ padding: "10px 20px", marginRight: 10 }}
        >
          ▶ Run Code
        </button>

        <button
          onClick={() => navigate("/input")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          💡 Try Another Idea
        </button>
      </div>
    </div>
  );
}
