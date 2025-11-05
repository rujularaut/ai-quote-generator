process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Map React categories to Quotable API tags
const tagMap = {
  motivational: "inspirational",
  life: "life",
  love: "love",
  tech: "technology"
};

// Endpoint to generate a quote based on category
app.post("/generate", async (req, res) => {
  try {
    const { category } = req.body;
    const tag = tagMap[category] || "inspirational"; // fallback if category not found

    const url = `https://api.quotable.io/random?tags=${tag}`;
    const response = await axios.get(url);

    res.json({ quote: response.data.content });
  } catch (error) {
    console.error("Error fetching quote:", error.message);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

// Optional: homepage message
app.get("/", (req, res) => {
  res.send("✅ AI Quote Generator backend is running (using free quotes API)");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
