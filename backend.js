require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Allow frontend to call this backend

console.log("🚀 Initializing backend server...");

// ✅ Load environment variables (from GitHub Secrets or fallback values)
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || "your-auth0-domain";
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || "your-client-id";
const AUTH0_REDIRECT_URI = process.env.AUTH0_REDIRECT_URI || "https://your-app.com/auth-callback";

if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    console.error("❌ Missing required Auth0 environment variables!");
    process.exit(1); // ❌ Stop execution if env variables are missing
}

console.log("✅ Auth0 Config Loaded");

// 🔹 **API Endpoint: Expose Auth0 Public Config**
app.get("/api/config", (req, res) => {
    console.log("📩 Received request for Auth0 config");

    res.json({
        auth0Domain: AUTH0_DOMAIN,
        clientId: AUTH0_CLIENT_ID,
        redirectUri: AUTH0_REDIRECT_URI,
    });
});

// 🔹 **Health Check Route**
app.get("/", (req, res) => {
    res.send("✅ Backend is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ✅ Export for testing/debugging
module.exports = app;
