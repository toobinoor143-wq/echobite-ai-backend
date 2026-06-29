const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Models
const Food = require("../models/Food");

// Files (sirf history ke liye use ho raha hai)
const VOICE_FILE = path.join(__dirname, "../voiceHistory.json");

/* =========================
   Helper Functions
========================= */

function readJSONFile(filePath, defaultValue = []) {
  if (!fs.existsSync(filePath)) return defaultValue;
  const data = fs.readFileSync(filePath, "utf8");
  return data ? JSON.parse(data) : defaultValue;
}

function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/* =========================
   🎤 VOICE ORDER
========================= */
router.post("/voice-order", (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({
      success: false,
      message: "Voice text required",
    });
  }

  const history = readJSONFile(VOICE_FILE);

  const newRecord = {
    id: Date.now(),
    type: "order",
    transcript,
    createdAt: new Date().toISOString(),
  };

  history.push(newRecord);
  writeJSONFile(VOICE_FILE, history);

  res.json({
    success: true,
    message: "Voice order saved",
    data: newRecord,
  });
});

/* =========================
   🔎 VOICE SEARCH (MONGODB FIXED)
========================= */
router.post("/voice-search", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Voice text required",
      });
    }

    const results = await Food.find({
      $or: [
        { name: { $regex: transcript, $options: "i" } },
        { category: { $regex: transcript, $options: "i" } },
      ],
    });

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   🤖 VOICE CHAT
========================= */
router.post("/voice-chat", (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({
      success: false,
      message: "Voice text required",
    });
  }

  let reply = "I didn't understand your command";

  const text = transcript.toLowerCase();

  if (text.includes("pizza")) {
    reply = "We have Chicken Pizza and Pepperoni Pizza";
  } else if (text.includes("burger")) {
    reply = "We have Zinger Burger available";
  } else if (text.includes("menu")) {
    reply = "Check /api/menu for full menu";
  }

  res.json({
    success: true,
    reply,
  });
});

/* =========================
   📜 VOICE HISTORY
========================= */
router.get("/voice-history", (req, res) => {
  const history = readJSONFile(VOICE_FILE);

  res.json({
    success: true,
    count: history.length,
    history,
  });
});

/* =========================
   ❌ DELETE HISTORY ITEM
========================= */
router.delete("/voice-history/:id", (req, res) => {
  const id = Number(req.params.id);

  const history = readJSONFile(VOICE_FILE);

  const updated = history.filter((item) => item.id !== id);

  writeJSONFile(VOICE_FILE, updated);

  res.json({
    success: true,
    message: "Deleted successfully",
  });
});

module.exports = router;