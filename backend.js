require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json()); // ✅ Ensure JSON body parsing is enabled

console.log("✅ Initializing backend server...");

// ✅ Debug log: Registering routes
console.log("✅ Registering /issue-vc route");

app.post("/issue-vc", async (req, res) => {
    console.log("✅ Received POST request to /issue-vc");  // Debug log
    console.log("📩 Request Body:", req.body);

    const { userId, email } = req.body;
    if (!userId || !email) {
        console.log("❌ Missing userId or email in request");
        return res.status(400).json({ error: "Missing userId or email" });
    }

    try {
        const authToken = await getAuth0Token();
        console.log("🔑 Auth0 Token Retrieved Successfully");

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

        const response = await axios.post(
            "https://dev-lyd8zg4866wjaxih.us.auth0.com/vc/issue",
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

async function getAuth0Token() {
    try {
        console.log("🔄 Requesting Auth0 Token...");
        const response = await axios.post("https://dev-lyd8zg4866wjaxih.us.auth0.com/oauth/token", {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: "https://dev-lyd8zg4866wjaxih.us.auth0.com/",
            grant_type: "client_credentials"
        });

        console.log("✅ Auth0 Token Retrieved");
        return response.data.access_token;
    } catch (error) {
        console.error("❌ Auth0 Token Request Failed:", error.response?.data || error.message);
        throw new Error("Auth0 authentication failed");
    }
}

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ✅ Export `app` for debugging
module.exports = app;
