const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/posts");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage
});

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Bike photo is required"
            });
        }

        const post = new Post({
            name: req.body.name || "Fozle Rabbi",
            bikeBrand: req.body.bikeBrand || "",
            bikeModel: req.body.bikeModel || "",
            bikeCC: req.body.bikeCC || "",
            caption: req.body.caption || "",
            image: "/uploads/posts/" + req.file.filename,
            likes: 0,
            likedBy: [],
            comments: []
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: post
        });
    } catch (error) {
        console.error("CREATE POST ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            posts: posts
        });
    } catch (error) {
        console.error("GET POSTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get posts",
            error: error.message
        });
    }
});

router.post("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (!post.likedBy) {
            post.likedBy = [];
        }

        const name = req.body.name || "Fozle Rabbi";

        const alreadyLiked = post.likedBy.includes(name);

        if (alreadyLiked) {
            post.likedBy = post.likedBy.filter(function (user) {
                return user !== name;
            });
        } else {
            post.likedBy.push(name);
        }

        post.likes = post.likedBy.length;

        await post.save();

        res.json({
            success: true,
            likes: post.likes,
            likedBy: post.likedBy
        });
    } catch (error) {
        console.error("LIKE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update like",
            error: error.message
        });
    }
});

router.post("/:id/comments", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const text = req.body.text;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }

        if (!post.comments) {
            post.comments = [];
        }

        post.comments.push({
            name: req.body.name || "Fozle Rabbi",
            text: text.trim(),
            createdAt: new Date()
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comments: post.comments
        });
    } catch (error) {
        console.error("COMMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add comment",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("DELETE POST ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message
        });
    }
});

module.exports = router;