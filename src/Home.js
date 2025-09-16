import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", textAlign: "center" }}>
      <h1>🚀 Thought-to-Code AI</h1>
      <p>Turn your ideas into code instantly</p>

      <button
        onClick={() => navigate("/input")}
        style={{ padding: "12px 24px", marginTop: "20px", fontSize: "18px" }}
      >
        Start
      </button>

      <footer style={{ marginTop: "50px", fontSize: "12px" }}>
        MindMakers Team • Hackathon Demo
      </footer>
    </div>
  );
}

export default Home;
