import express from "express";
import Thread from "../models/thread.js";

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

export default router;