import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";

const QRSignUp = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch("/api/config") // Fetch secrets from backend
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((error) => console.error("❌ Failed to load config", error));
  }, []);

  if (!config) return <p>Loading...</p>;

  const auth0SignupURL = `https://${config.auth0Domain}/authorize?client_id=${config.clientId}&response_type=code&redirect_uri=${config.redirectUri}`;

  return (
    <div>
      <h2>Scan to Sign Up</h2>
      <QRCode value={auth0SignupURL} size={256} />
    </div>
  );
};

export default QRSignUp;
