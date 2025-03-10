require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Function to get Auth0 API Token
async function getAuth0Token() {
  try {
    const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: "client_credentials"
    });

    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error getting Auth0 token:", error.response?.data || error.message);
    throw new Error("Auth0 token request failed");
  }
}

// Function to store Verifiable Credential in Auth0 user metadata
async function storeVC(userId, vc) {
  try {
    const authToken = await getAuth0Token();

    await axios.patch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
      app_metadata: { verifiable_credential: vc }
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    console.log("✅ Verifiable Credential stored successfully.");
  } catch (error) {
    console.error("❌ Error storing VC:", error.response?.data || error.message);
  }
}

// API Endpoint to Issue & Store VC
app.post("/issue-vc", async (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: "Missing userId or email" });
  }

  const vcPayload = {
    credential: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiableCredential"],
      "issuer": "did:example:issuer",
      "credentialSubject": {
        "id": `did:example:${userId}`,
        "email": email,
        "event": "Faster Zebra Conference 2024"
      }
    }
  };

  try {
    const issuedVC = JSON.stringify(vcPayload);
    await storeVC(userId, issuedVC);

    res.json({ message: "VC issued and stored successfully", vc: issuedVC });
  } catch (error) {
    res.status(500).json({ error: "Failed to issue/store VC" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
