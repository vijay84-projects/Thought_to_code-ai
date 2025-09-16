// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";

// ✅ Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config({ path: path.join(__dirname, "../ini.env") });

const app = express();
const port = process.env.PORT || 4000;

// ✅ Middleware (no dangling parenthesis!)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "1mb" }));

// ✅ API Key check
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY in ini.env");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend is running ✅" });
});

// ✅ Main Code Generation Route
app.post("/api/generate", async (req, res) => {
  try {
    const { idea, language = "javascript" } = req.body;

    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({ error: "❌ Missing 'idea' in request body" });
    }

    console.log("💡 Generating code for idea:", idea);

    const prompt = `
You are a helpful assistant that writes short, correct, and runnable ${language} code from a user's idea.
Rules:
- Produce only code block(s) with minimal comments.
- Keep it short (under 60 lines) unless user asks for more.
- If the idea is ambiguous, make reasonable assumptions and note them in a one-line comment.
User idea: "${idea}"
Return ONLY valid JSON with fields:
{ "code": "...", "explanation": "..." }
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise code generator. Always return valid JSON." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.2,
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || "";
    console.log("📝 Raw model response:", text);

    let parsed = null;
    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      }
    } catch (err) {
      console.warn("⚠️ Could not parse response as JSON:", err.message);
    }

    if (parsed?.code) {
      return res.json({ code: parsed.code, explanation: parsed.explanation || "" });
    } else {
      const fallbackCode = text.replace(/```(?:\w+)?/g, "").trim();
      return res.json({ code: fallbackCode, explanation: "" });
    }
  } catch (err) {
    console.error("❌ Generation error:", err);
    res.status(500).json({
      error: "Generation failed",
      details: err.message || String(err),
    });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
