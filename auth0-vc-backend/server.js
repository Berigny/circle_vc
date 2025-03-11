const axios = require("axios");
require("dotenv").config();

// ✅ Function to Store a Verifiable Credential in Auth0 Metadata
async function storeVC(userId, vc) {
    try {
        // Step 1: Get an Auth0 Management API Token
        const tokenResponse = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
            grant_type: "client_credentials"
        });

        const authToken = tokenResponse.data.access_token;

        // Step 2: Store the Verifiable Credential in Auth0 Metadata
        await axios.patch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
            app_metadata: { verifiable_credential: vc }
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log(`✅ Verifiable Credential stored successfully for user: ${userId}`);
    } catch (error) {
        console.error("❌ Error storing VC:", error.response?.data || error.message);
    }
}

// ✅ Example Usage (Manually Issue a VC for a Slack User)
const TEST_USER_ID = "oauth2|slack-oauth2|T08GXF2T562-U08GXF2T7TY";
const TEST_VC = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential"],
    "issuer": "did:example:issuer",
    "credentialSubject": {
        "id": `did:example:${TEST_USER_ID}`,
        "email": "test@example.com",
        "event": "Circle Member Events 2024"
    }
};

// ✅ Call storeVC() only when you want to issue a VC manually
storeVC(TEST_USER_ID, TEST_VC);

