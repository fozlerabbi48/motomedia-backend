const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { sender, receiver, text } = req.body;

        if (!sender || !receiver || !text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Sender, receiver and message are required"
            });
        }

        const message = new Message({
            sender: sender.trim(),
            receiver: receiver.trim(),
            text: text.trim()
        });

        await message.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message
        });
    } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
});

router.get("/:user1/:user2", async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    sender: user1,
                    receiver: user2
                },
                {
                    sender: user2,
                    receiver: user1
                }
            ]
        }).sort({
            createdAt: 1
        });

        res.json({
            success: true,
            messages: messages
        });
    } catch (error) {
        console.error("GET MESSAGES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load messages",
            error: error.message
        });
    }
});

module.exports = router;