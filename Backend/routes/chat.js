import express from "express";
import Thread from "../models/thread.js";
import getGeminiAiResponse from "../utils/geminiAi.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz123",
      title: "Testing Thread",
    });

    const responst = await thread.save();
    res.send(responst);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to save in Database" });
  }
});

// Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch Threads" });
  }
});

//Get a specific thread by ID
router.get("/thread/:id", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).send({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch Thread" });
  }
});

// Delete a specific thread by ID
router.delete("/thread/:id", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).send({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete Thread" });
  }
});

// Handle chat messages
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).send({ error: "missing required fields" });
  }
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      //create new thread in DB
      const thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const geminiResponse = await getGeminiAiResponse(message);

    thread.messages.push({ role: "assistant", content: geminiResponse });
    thread.updatedAt = Date.now();

    await thread.save();
    res.status(200).json({ reply: geminiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Something went wrong!" });
  }
});

export default router;
