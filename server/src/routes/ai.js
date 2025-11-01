import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { idea } = req.body;
    const response = await axios.post("http://127.0.0.1:8000/generate", { idea });
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error connecting to AI service:", err.message);
    res.status(500).json({ error: "Failed to generate blueprint" });
  }
});

export default router;
