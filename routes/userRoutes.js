const express = require("express");
const multer = require("multer");
const path = require("path");

const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/profiles");
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


router.get("/search", async (req, res) => {
    try {
        const { q, currentUserId } = req.query;

        if (!q || !q.trim()) {
            return res.json({
                success: true,
                users: []
            });
        }

        const searchText = q.trim();

        const filter = {
            $or: [
                {
                    name: {
                        $regex: searchText,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: searchText,
                        $options: "i"
                    }
                }
            ]
        };

        if (currentUserId) {
            filter._id = {
                $ne: currentUserId
            };
        }

        const users = await User.find(filter)
            .select("_id name email profilePhoto")
            .limit(20)
            .sort({ name: 1 });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error("USER SEARCH ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search users"
        });
    }
});


router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("GET MY PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load profile"
        });
    }
});


router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("GET USER PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load user profile"
        });
    }
});


router.patch(
    "/me/profile",
    authMiddleware,
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1
        },
        {
            name: "coverPhoto",
            maxCount: 1
        }
    ]),
    async (req, res) => {
        try {
            const user = await User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const {
                name,
                bio,
                location,
                phone,
                education,
                university,
                profession,
                skills,
                about,
                facebook,
                instagram,
                linkedin,
                website
            } = req.body;

            if (name !== undefined) {
                user.name = name.trim();
            }

            if (bio !== undefined) {
                user.bio = bio.trim();
            }

            if (location !== undefined) {
                user.location = location.trim();
            }

            if (phone !== undefined) {
                user.phone = phone.trim();
            }

            if (education !== undefined) {
                user.education = education.trim();
            }

            if (university !== undefined) {
                user.university = university.trim();
            }

            if (profession !== undefined) {
                user.profession = profession.trim();
            }

            if (skills !== undefined) {
                user.skills = skills.trim();
            }

            if (about !== undefined) {
                user.about = about.trim();
            }

            if (!user.socialLinks) {
                user.socialLinks = {};
            }

            if (facebook !== undefined) {
                user.socialLinks.facebook = facebook.trim();
            }

            if (instagram !== undefined) {
                user.socialLinks.instagram = instagram.trim();
            }

            if (linkedin !== undefined) {
                user.socialLinks.linkedin = linkedin.trim();
            }

            if (website !== undefined) {
                user.socialLinks.website = website.trim();
            }

            if (
                req.files &&
                req.files.profilePhoto &&
                req.files.profilePhoto[0]
            ) {
                user.profilePhoto =
                    "/uploads/profiles/" +
                    req.files.profilePhoto[0].filename;
            }

            if (
                req.files &&
                req.files.coverPhoto &&
                req.files.coverPhoto[0]
            ) {
                user.coverPhoto =
                    "/uploads/profiles/" +
                    req.files.coverPhoto[0].filename;
            }

            await user.save();

            res.json({
                success: true,
                message: "Profile updated successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePhoto: user.profilePhoto,
                    coverPhoto: user.coverPhoto,
                    bio: user.bio,
                    location: user.location,
                    phone: user.phone,
                    education: user.education,
                    university: user.university,
                    profession: user.profession,
                    skills: user.skills,
                    about: user.about,
                    socialLinks: user.socialLinks
                }
            });
        } catch (error) {
            console.error("UPDATE PROFILE ERROR:", error);

            res.status(500).json({
                success: false,
                message: "Failed to update profile",
                error: error.message
            });
        }
    }
);


module.exports = router;