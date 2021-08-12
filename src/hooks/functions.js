import { useCallback, useEffect, useState, useContext } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useContextStore } from "../contexts/store";

import PostContractAbi from "../build/contracts/PostList.json"
import UserContractAbi from "../build/contracts/UserList.json"
import TruffleContract from "@truffle/contract"
// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = "INVALID_INFURA_KEY";

const NETWORK_NAME = "ropsten";

async function createNewPost(content, user) {
  await user.postContract.createPost(content, user.defaultAccount, {from: user.defaultAccount})
  window.location.reload()
}

async function readDeployedContract(contractAbi, provider) {
  const contract = TruffleContract(contractAbi)
  contract.setProvider(provider.provider)
  const c = await contract.deployed()
  return c
}

async function readPostList(user) {
  const posts = await user.postContract.getPastEvents('PostCreated', {
    fromBlock: 0,
    toBlock: 'latest',
    filter: {from: user.defaultAccount}
  });
  user.postList = posts.map(x => x.args.content)
}

async function readUser(user) {
  const u = await user.userContract.users(user.defaultAccount)
  user.userData = u
}

async function doAppJob(setUser, provider) {
  if (provider === undefined) return

  const postContract = await readDeployedContract(PostContractAbi, provider)
  const userContract = await readDeployedContract(UserContractAbi, provider)

  const defaultAccount = (await provider.listAccounts())[0]
  const u = {
    defaultAccount: defaultAccount,
    provider: provider,
    postContract: postContract,
    userContract: userContract,
  }
  await readPostList(u)
  await readUser(u)
  setUser(u)
}

function useWeb3Modal(config = {}) {
  const [user, setUser] = useContextStore()
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
    doAppJob(setUser, provider)

    setProvider(provider);
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
  useWeb3Modal,
  createNewPost
};
