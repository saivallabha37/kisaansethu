import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();   // <-- define app here
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("Gemini API Key:", GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

// Routes
app.post("/api/crop-advice", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini API response:", data);
    res.json(data);
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to get crop advice" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Backend is up and running ✅');
});
