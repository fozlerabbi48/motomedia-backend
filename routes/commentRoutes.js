const express = require("express");
const Comment = require("../models/Comment");

const router = express.Router();

router.post("/:postId", async (req, res) => {
    try {
        const { name, comment } = req.body;

        if (!name || !comment) {
            return res.status(400).json({
                message: "Name and comment are required"
            });
        }

        const newComment = await Comment.create({
            postId: req.params.postId,
            name,
            comment
        });

        res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
});

router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({
            postId: req.params.postId
        }).sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get comments",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        res.json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete comment",
            error: error.message
        });
    }
});

module.exports = router;