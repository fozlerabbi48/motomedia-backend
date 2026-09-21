const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        profilePhoto: {
            type: String,
            default: ""
        },

        coverPhoto: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            trim: true,
            default: ""
        },

        location: {
            type: String,
            trim: true,
            default: ""
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        education: {
            type: String,
            trim: true,
            default: ""
        },

        university: {
            type: String,
            trim: true,
            default: ""
        },

        profession: {
            type: String,
            trim: true,
            default: ""
        },

        skills: {
            type: String,
            trim: true,
            default: ""
        },

        about: {
            type: String,
            trim: true,
            default: ""
        },

        socialLinks: {
            facebook: {
                type: String,
                trim: true,
                default: ""
            },

            instagram: {
                type: String,
                trim: true,
                default: ""
            },

            linkedin: {
                type: String,
                trim: true,
                default: ""
            },

            website: {
                type: String,
                trim: true,
                default: ""
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);