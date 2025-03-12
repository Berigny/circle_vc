import React from "react";
import QRCode from "qrcode.react";

// Retrieve Auth0 variables from environment
const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN || "your-default.auth0.com";
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "your-default-client-id";
const redirectUri = process.env.REACT_APP_AUTH0_REDIRECT_URI || "https://your-app.com/auth-callback";

const QRSignUp = () => {
  // Dynamically generate the Auth0 signup URL
  const auth0SignupURL = `https://${auth0Domain}/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;

  return (
    <div>
      <h2>Scan to Sign Up</h2>
      <QRCode value={auth0SignupURL} size={256} />
    </div>
  );
};

export default QRSignUp;
