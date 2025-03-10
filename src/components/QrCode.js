import React from "react";
import QRCode from "qrcode.react";

const QRSignUp = () => {
  const auth0SignupURL = "https://your-auth0-domain/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://your-app.com/auth-callback";

  return (
    <div>
      <h2>Scan to Sign Up</h2>
      <QRCode value={auth0SignupURL} size={256} />
    </div>
  );
};

export default QRSignUp;
