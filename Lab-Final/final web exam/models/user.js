const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "editor", "user"],
        default: "user",
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "alkproduct" }] // Reference to Product model
});

const User = mongoose.model("user", userSchema);
module.exports = User;
