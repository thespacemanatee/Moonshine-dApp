import React, { useCallback, useContext, useMemo } from "react";

import { useWeb3 } from "@providers/index";

type ElectionContextProps = {
  createElection: (electionName: string, organisationName: string) => void;
};

const ElectionContext = React.createContext<ElectionContextProps | null>(null);

type ElectionProviderProps = {
  children: React.ReactNode;
};

const ElectionProvider = ({ children }: ElectionProviderProps) => {
  const { web3, contract, currentAddress } = useWeb3();

  const createElection = useCallback(
    (electionName: string, organisationName: string) => {
      contract?.methods
        .initElection(electionName, organisationName)
        .send({ from: currentAddress })
        .once("sending", console.log)
        .once("sent", console.log)
        .once("transactionHash", console.log)
        .once("receipt", console.log)
        .on(
          "confirmation",
          (confNumber: string, receipt: string, latestBlockHash: string) => {
            console.log(
              "Block Confirmation",
              confNumber,
              receipt,
              latestBlockHash
            );
          }
        )
        .on("error", console.error)
        .then((receipt: string) => {
          // will be fired once the receipt is mined
          console.log(`Election created! Receipt: ${receipt}`);
        });
    },
    [contract?.methods, currentAddress]
  );

  const contextValue = useMemo(
    () => ({
      createElection,
    }),
    [createElection]
  );

  return (
    <ElectionContext.Provider value={contextValue}>
      {children}
    </ElectionContext.Provider>
  );
};

const useElection = () => {
  const election = useContext(ElectionContext);
  if (election == null) {
    throw new Error("useWeb3() called outside of a Web3Provider?");
  }
  return election;
};

export { ElectionProvider, useElection };
