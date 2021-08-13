import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import UserPostContractAbi from "../build/contracts/UserPost.json"
import TruffleContract from "@truffle/contract"
// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = "INVALID_INFURA_KEY";

const NETWORK_NAME = "ropsten";

async function readDeployedContract(contractAbi, provider) {
  const contract = TruffleContract(contractAbi)
  contract.setProvider(provider.provider)
  const c = await contract.deployed()
  return c
}

async function readPostList(user, setUser) {
  const result = [];
  if (user === undefined || user.userData === undefined) return result;

  for (var i = 0; i < user.userData.postCount; i++) {
    const post = await user.contract.posts(user.defaultAccount, i)
    result.push({ content: post.content, timestamp: new Date(post.timestamp * 1000) })
  }
  user.postList = result;
  setUser(user)
}

async function readUser(setRegistered, user, setUser) {
  const u = await user.contract.users(user.defaultAccount)
  if (u.email === '') return;

  const count = await user.contract.postCounts(user.defaultAccount)
  console.log(count.toNumber())
  user.userData = {
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    postCount: count.toNumber(),
  }
  setUser(user)
  setRegistered(true)
}

async function doAppJob(setRegistered, user, setUser, provider) {
  if (provider === undefined) return

  const userPostContract = await readDeployedContract(UserPostContractAbi, provider)
  const defaultAccount = (await provider.listAccounts())[0]

  user.defaultAccount = defaultAccount
  user.provider = provider
  user.contract = userPostContract

  await readUser(setRegistered, user, setUser)
  await readPostList(user, setUser)
}

function useWeb3Modal(setLoading, setRegistered, user, setUser, config = {}) {
  const [provider, setProvider] = useState();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, infuraId = INFURA_ID, NETWORK = NETWORK_NAME } = config;

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
    },
  });

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    const provider = new Web3Provider(newProvider);
    await doAppJob(setRegistered, user, setUser, provider)
    setProvider(provider);
    setLoading(false)
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(async () => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export {
  useWeb3Modal
};
