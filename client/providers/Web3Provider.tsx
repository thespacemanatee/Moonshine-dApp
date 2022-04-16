import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

import Election from "../contracts/Election.json";

type Web3ContextProps = {
  isLoading: boolean;
  web3?: Web3;
  contract?: Contract;
  contractAddress?: string;
  currentAddress?: string;
  currentBalance?: string;
  currentNetworkType?: string;
  isAdmin: boolean;
};

const Web3Context = React.createContext<Web3ContextProps | null>(null);

type Web3ProviderProps = {
  children: React.ReactNode;
};

const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract>();
  const [contractAddress, setContractAddress] = useState<string>();
  const [currentAddress, setCurrentAddress] = useState<string>();
  const [currentBalance, setCurrentBalance] = useState<string>();
  const [currentNetworkType, setCurrentNetworkType] = useState<string>();
  const [isAdmin, setIsAdmin] = useState(false);

  const updateAccount = async (accounts: string[], web3: Web3) => {
    setIsLoading(true);
    const account = accounts[0];
    const balance = await web3.eth.getBalance(account);
    const networkType = await web3.eth.net.getNetworkType();
    setCurrentAddress(account);
    setCurrentBalance(balance);
    setCurrentNetworkType(networkType);
    setIsLoading(false);
  };

  const getWeb3 = useCallback(
    () =>
      new Promise<Web3>((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
          if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            window.ethereum.on("accountsChanged", (accounts: string[]) => {
              updateAccount(accounts, web3);
            });
            try {
              resolve(web3);
            } catch (error) {
              reject(error);
            }
          } else if (window.web3) {
            const web3 = window.web3;
            console.log("Injected web3 detected.");
            resolve(web3);
          } else {
            const provider = new Web3.providers.HttpProvider(
              "http://127.0.0.1:8545"
            );
            const web3 = new Web3(provider);
            console.log("No web3 instance injected, using Local web3.");
            resolve(web3);
          }
        });
      }),
    []
  );

  useEffect(() => {
    if (!contract) {
      return;
    }
    setIsLoading(true);
    (async () => {
      const adminAddress = (
        await contract.methods.getAdmin().call()
      ).toLowerCase();
      setIsAdmin(adminAddress === currentAddress?.toLowerCase());
    })();
    setIsLoading(false);
  }, [contract, currentAddress]);

  useEffect(() => {
    if (!web3) {
      return;
    }
    setIsLoading(true);
    (async () => {
      const accounts = await web3.eth.requestAccounts();
      await updateAccount(accounts, web3);
    })();
    setIsLoading(false);
  }, [web3]);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        setIsLoading(true);
        const res = await getWeb3();
        // Get the contract instance.
        const networkId = await res.eth.net.getId();
        // @ts-ignore
        const deployedNetwork = Election.networks[networkId];

        const contract = new res.eth.Contract(
          Election.abi as AbiItem[],
          deployedNetwork && deployedNetwork.address
        );
        setWeb3(res);
        setContract(contract);
        setContractAddress(deployedNetwork.address);
      } catch (err) {
        console.error(err);
      }
    };
    initWeb3();
  }, [getWeb3]);

  const contextValue = useMemo(
    () => ({
      isLoading,
      web3,
      contract,
      contractAddress,
      currentAddress,
      currentBalance,
      currentNetworkType,
      isAdmin,
    }),
    [
      contract,
      contractAddress,
      currentAddress,
      currentBalance,
      currentNetworkType,
      isAdmin,
      isLoading,
      web3,
    ]
  );

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
};

const useWeb3 = () => {
  const web3 = useContext(Web3Context);
  if (web3 == null) {
    throw new Error("useWeb3() called outside of a Web3Provider?");
  }
  return web3;
};

export { Web3Provider, useWeb3 };
