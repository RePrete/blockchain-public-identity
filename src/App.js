import React from "react";
import { useCallback, useEffect, useState, useContext } from "react";
import { StoreContext, useContextStore } from "./contexts/store";

import { Body, Button, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import ContractAbi from "./build/contracts/PostList.json"
import TruffleContract from "@truffle/contract"

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
async function createNewPost(content, user) {
  user.contract.createPost(content, {from: user.defaultAccount})
}

function PostList({ user }) {
  return (
    <ul>
      {user && user.postList ? user.postList.map((item, index) => { return <li key={index}>{item}</li> }) : ''}
    </ul>
  );
  return ''
}
function App() {
  const [user, setUser] = useContextStore()
  const [newTaskContent, setNewTaskContent] = useState()
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
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
