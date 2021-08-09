import { useCallback, useEffect, useState, useContext } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useContextStore } from "../contexts/store";

import ContractAbi from "../build/contracts/PostList.json"
import TruffleContract from "@truffle/contract"
// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = "INVALID_INFURA_KEY";

const NETWORK_NAME = "ropsten";


async function readDeployedContract(provider) {
  const PostContract = TruffleContract(ContractAbi)
  PostContract.setProvider(provider.provider)
  const contract = await PostContract.deployed()
  return contract
}

async function readPostList(contract) {
  const c = await contract
  const count = await c.postCount()
  const list = []
  for (var i = 0; i < count; i++) {
    list.push((await c.posts(i))[1])
  }
  return list
}

async function doAppJob(setUser, provider) {
  if (provider === undefined) return
  const contract = await readDeployedContract(provider)
  const u = {
    defaultAccount: (await provider.listAccounts())[0],
    provider: provider,
    contract: contract,
    postList: await readPostList(contract)
  }
  setUser(u)
}

function useWeb3Modal(config = {}) {
  const [user, setUser] = useContextStore()
  const [provider, setProvider] = useState();
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState();
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
    const account = (await provider.listAccounts())[0]
    doAppJob(setUser, provider)

    setProvider(provider);
    setDefaultAccount(account);
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
    doAppJob(setUser, provider)

  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
