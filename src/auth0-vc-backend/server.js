const axios = require("axios");
require("dotenv").config();

async function storeVC(userId, vc) {
  try {
    const tokenResponse = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials"
    });

    const authToken = tokenResponse.data.access_token;

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

// Example: Issue a VC for a new Slack user
storeVC("oauth2|slack-oauth2|T08GXF2T562-U08GXF2T7TY", "my-verifiable-credential");
