import React, { useContext, useEffect, useMemo, useState } from "react";
import Web3 from "web3";

type Web3ContextProps = {
  web3?: Web3;
};

const Web3Context = React.createContext<Web3ContextProps | null>(null);

type Web3ProviderProps = {
  children: React.ReactNode;
};

const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [web3, setWeb3] = useState<Web3>();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const res = await getWeb3();
        setWeb3(res);
      } catch (err) {
        console.error(err);
      }
    };
    initWeb3();
  }, []);

  const getWeb3 = () =>
    new Promise<Web3>((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            await window.ethereum.enable();
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
    });

  const contextValue = useMemo(() => ({ web3 }), [web3]);

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
