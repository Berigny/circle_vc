import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const PrivatePageRedirect = () => {
  const { user, isAuthenticated } = useAuth0();
  const [vcIssued, setVcIssued] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !vcIssued) {
      axios.post("http://localhost:5000/issue-vc", {
        userId: user.sub,
        email: user.email
      })
      .then(() => {
        setVcIssued(true);
        window.location.href = "https://community.fasterzebra.com/share/6I1Xlo22V70qznFC";
      })
      .catch(error => console.error("VC Issuance Error:", error));
    }
  }, [isAuthenticated, user, vcIssued]);

  return <div>Redirecting...</div>;
};

export default PrivatePageRedirect;
