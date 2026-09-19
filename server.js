const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/MessageRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
    res.json({
        message: "MotoMedia API is running"
    });
});

app.use("/api/posts", postRoutes);

app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Backend server running on http://localhost:${PORT}`
    );
});