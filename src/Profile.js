import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  const issueCredential = async () => {
    if (!isAuthenticated) return;
    const token = await getAccessTokenSilently();
    const response = await fetch("https://your-backend.com/issue-vc", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.sub,
        templateId: "vc_B7lIGg2qqMeh9la2", // Replace with your Template ID from Step 1
      }),
    });
    const { qrCodeUrl, deepLink } = await response.json();
    // Display the QR code or deep link to the user
    console.log("QR Code URL:", qrCodeUrl);
    console.log("Deep Link:", deepLink);
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    isAuthenticated && (
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button onClick={issueCredential}>Get Your Event Credential</button>
      </div>
    )
  );
};

export default Profile;