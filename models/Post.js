const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        text: {
            type: String,
            required: true,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

const postSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        bikeBrand: {
            type: String,
            required: true,
            trim: true
        },

        bikeModel: {
            type: String,
            required: true,
            trim: true
        },

        bikeCC: {
            type: String,
            trim: true
        },

        image: {
            type: String,
            required: true
        },

        caption: {
            type: String,
            trim: true
        },

        likes: {
            type: Number,
            default: 0
        },

        likedBy: {
            type: [String],
            default: []
        },

        comments: {
            type: [commentSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);