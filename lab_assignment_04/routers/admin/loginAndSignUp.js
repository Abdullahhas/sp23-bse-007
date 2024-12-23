const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const router = express.Router();

const SALT_ROUNDS = 10; // Number of salt rounds for hashing

// Login Page
router.get("/login", (req, res) => {
    res.render("admin/login", { layout: "layouts/panel", user: [] });
});

// Login Functionality
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("admin/login", {
                layout: "layouts/panel",
                user: { message: "Invalid username or password" },
            });
        }

        // Compare the hashed password with the provided password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("admin/login", {
                layout: "layouts/panel",
                user: { message: "Invalid username or password" },
            });
        }

        // Store user data in session (only non-sensitive info)
        req.session.user = { id: user._id, email: user.email };
        res.redirect("/admin");
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("An error occurred during login.");
    }
});

// Signup Page
router.get("/signup", (req, res) => {
    res.render("admin/signup", { layout: "layouts/panel" });
});

// Signup Functionality with Password Hashing
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.send("User already exists");
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new user with the hashed password
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.redirect("/login");
    } catch (err) {
        console.error("Error during sign-up:", err);
        res.status(500).send("An error occurred during sign-up.");
    }
});

// Logout Functionality
router.get("/logout", (req, res) => {
    req.session.user = null; // Clear the session user
    res.redirect("/login");
});

module.exports = router;
 