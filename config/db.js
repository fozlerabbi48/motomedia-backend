const mongoose = require("mongoose");

require("dotenv").config();

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    })
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:");
        console.error(error);
    });

module.exports = mongoose;