import React from "react";
import { useState } from "react";
import { useContextStore } from "./contexts/store";

import { Body, Button, Header, Image } from "./components";
import logo from "./ethereumLogo.png";
import { useWeb3Modal, createNewPost } from "./hooks/functions";

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

function PostList({ user }) {
  return (
    <ul>
      {user && user.postList ? user.postList.map((item, index) => { return <li key={index}>{item}</li> }) : ''}
    </ul>
  );
}
function App() {
  const [user] = useContextStore()
  window.u = user
  const [newTaskContent, setNewTaskContent] = useState()
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <div>User: { user && user.userData ? user.userData.email : null }</div>
        <Image src={logo} alt="react-logo" />
        <form onSubmit={async (event) => { event.preventDefault(); createNewPost(newTaskContent, user) }}>
          <textarea value={newTaskContent} onChange={(event) => setNewTaskContent(event.target.value)} />
          <input type="submit" hidden="" />
        </form>
        <PostList user={user} />
      </Body>
    </div>
  );
}

export default App;
