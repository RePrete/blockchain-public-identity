import React, { useState } from "react";
import { initialState } from "./contexts/Store";

import { Body, Button, Header } from "./components";
import { useWeb3Modal } from "./hooks/functions";
import RegisterComponent from "./components/RegisterComponent"
import PostsComponent from "./components/PostsComponent"
import { useEffect } from "react/cjs/react.development";

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function App() {
  const [user, setUser] = useState(initialState)
  const [isRegistered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal(setLoading, setRegistered, user, setUser);

  const postsComponent = (<PostsComponent user={user} />)
  const registerComponent = (<RegisterComponent user={user} />)

  if (loading) return (<p>Loading</p>)

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
          { !isRegistered ? registerComponent : postsComponent }
      </Body>
      <br />
    </div>
  );
}

export default App;
