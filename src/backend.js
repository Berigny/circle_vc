/*const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// Function to dynamically get the access token from Auth0
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE || `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to get access token");
  }
};

app.post("/issue-vc", async (req, res) => {
  const { userId, templateId } = req.body;
  try {
    const accessToken = await getAccessToken();
    const vcIssueUrl = `https://${process.env.AUTH0_DOMAIN}/api/vc/issue`; // Use env variable for domain
    const response = await axios.post(
      vcIssueUrl,
      {
        user_id: userId,
        template_id: templateId,
        redirect_uri:
          process.env.REDIRECT_URI || "https://your-app.com/issuance-complete",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({
      qrCodeUrl: response.data.qrCodeUrl,
      deepLink: response.data.deepLink,
    });
  } catch (error) {
    console.error(
      "Error issuing VC:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to issue VC" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));*/


require('dotenv').config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/issue-vc", async (req, res) => {
  const { userId, email } = req.body;

  const authToken = await getAuth0Token();

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
    const response = await axios.post(
      "https://your-auth0-domain/vc/issue",
      vcPayload,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response.data });
  }
});

async function getAuth0Token() {
  const response = await axios.post("https://your-auth0-domain/oauth/token", {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: "https://your-auth0-domain/",
    grant_type: "client_credentials"
  });
  return response.data.access_token;
}

app.listen(5000, () => console.log("Server running on port 5000"));
