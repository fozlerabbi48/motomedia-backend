const express = require("express");
const multer = require("multer");
const path = require("path");

const Post = require("../models/Post");
const authMiddleware = require("../middlewares/authMiddleware");

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


router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Bike photo is required"
                });
            }

            if (!req.body.bikeBrand) {
                return res.status(400).json({
                    success: false,
                    message: "Bike brand is required"
                });
            }

            if (!req.body.bikeModel) {
                return res.status(400).json({
                    success: false,
                    message: "Bike model is required"
                });
            }

            const post = new Post({
                userId: req.user.userId,

                name: req.user.name,

                bikeBrand: req.body.bikeBrand,

                bikeModel: req.body.bikeModel,

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
    }
);


router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({
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


router.post(
    "/:id/like",
    authMiddleware,
    async (req, res) => {
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

            const userId = req.user.userId.toString();

            const alreadyLiked = post.likedBy.some(
                function (id) {
                    return id.toString() === userId;
                }
            );

            if (alreadyLiked) {
                post.likedBy = post.likedBy.filter(
                    function (id) {
                        return id.toString() !== userId;
                    }
                );
            } else {
                post.likedBy.push(userId);
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
    }
);


router.post(
    "/:id/comments",
    authMiddleware,
    async (req, res) => {
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
                userId: req.user.userId,

                name: req.user.name,

                text: text.trim()
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
    }
);


router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found"
                });
            }

            if (
                post.userId &&
                post.userId.toString() !==
                    req.user.userId.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You can only delete your own post"
                });
            }

            await Post.findByIdAndDelete(req.params.id);

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
    }
);


module.exports = router;