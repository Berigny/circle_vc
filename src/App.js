/*import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <Profile />
      <LoginButton />
      <LogoutButton />
    </div>
  );
}

export default App;*/

import React from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

const App = () => {
  return (
    <Auth0Provider
      domain="your-auth0-domain"
      clientId="your-auth0-client-id"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <Auth />
    </Auth0Provider>
  );
};

const Auth = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Sign Up / Log In</button>
      ) : (
        <>
          <h3>Welcome, {user.name}!</h3>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</button>
        </>
      )}
    </div>
  );
};

export default App;
