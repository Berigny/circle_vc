require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json()); // ✅ Enable JSON body parsing
app.use(cors()); // ✅ Allow frontend to communicate with backend

console.log("🚀 Initializing backend server...");

// ✅ Load Environment Variables (Ensure they exist)
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || `https://${AUTH0_DOMAIN}/`;

if (!AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET || !AUTH0_DOMAIN) {
    console.error("❌ Missing required Auth0 environment variables!");
    process.exit(1); // ❌ Stop execution if env variables are missing
}

console.log("✅ Auth0 Config Loaded");

// ✅ Debug: Register Routes
console.log("✅ Registering /issue-vc route");

// 🔹 **Route: Issue Verifiable Credential**
app.post("/issue-vc", async (req, res) => {
    console.log("📩 Received POST request to /issue-vc");
    console.log("🔍 Request Body:", req.body);

    const { userId, email } = req.body;
    if (!userId || !email) {
        console.log("❌ Missing userId or email in request");
        return res.status(400).json({ error: "Missing userId or email" });
    }

    try {
        console.log("🔄 Retrieving Auth0 Token...");
        const authToken = await getAuth0Token();

        console.log("🔑 Auth0 Token Retrieved Successfully");

        // ✅ Build Verifiable Credential Payload
        const vcPayload = {
            credential: {
                "@context": ["https://www.w3.org/2018/credentials/v1"],
                "type": ["VerifiableCredential"],
                "issuer": "did:example:issuer",
                "credentialSubject": {
                    "id": `did:example:${userId}`,
                    "email": email,
                    "event": "Circle Member Events 2024"
                }
            }
        };

        console.log("📤 Sending VC Issuance Request...");

        const response = await axios.post(
            `https://${AUTH0_DOMAIN}/vc/issue`,
            vcPayload,
            { headers: { Authorization: `Bearer ${authToken}` } }
        );

        console.log("✅ Verifiable Credential Issued Successfully");
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error issuing VC:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

// 🔹 **Function: Get Auth0 Access Token**
async function getAuth0Token() {
    try {
        console.log("🔄 Requesting Auth0 Token...");
        const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: AUTH0_AUDIENCE,
            grant_type: "client_credentials"
        });

        console.log("✅ Auth0 Token Retrieved Successfully");
        return response.data.access_token;
    } catch (error) {
        console.error("❌ Auth0 Token Request Failed:", error.response?.data || error.message);
        throw new Error("Auth0 authentication failed");
    }
}

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ✅ Export for testing/debugging
module.exports = app;
