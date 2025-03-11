require("dotenv").config();
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
      "https://dev-lyd8zg4866wjaxih.us.auth0.com/vc/issue",
      vcPayload,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

async function getAuth0Token() {
  const response = await axios.post("https://dev-lyd8zg4866wjaxih.us.auth0.com/oauth/token", {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: "https://dev-lyd8zg4866wjaxih.us.auth0.com/",
    grant_type: "client_credentials"
  });
  return response.data.access_token;
}

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

