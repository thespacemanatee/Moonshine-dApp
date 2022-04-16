import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PromiEvent } from "web3-core";

import { useWeb3 } from "@providers/index";
import { ElectionInfo } from "types";

type ElectionContextProps = {
  electionInfo?: ElectionInfo;
  createElection: (
    electionName: string,
    organisationName: string
  ) => PromiEvent<any>;
};

const ElectionContext = React.createContext<ElectionContextProps | null>(null);

type ElectionProviderProps = {
  children: React.ReactNode;
};

const ElectionProvider = ({ children }: ElectionProviderProps) => {
  const [electionInfo, setElectionInfo] = useState<ElectionInfo>();
  const { contract, currentAddress } = useWeb3();

  useEffect(() => {
    if (contract == null) {
      return;
    }
    contract.events.ElectionCreated((error: any, result: any) => {
      const returnValues = result.returnValues;
      console.log(error, returnValues);

      if (!error) {
        setElectionInfo({
          electionName: returnValues[0],
          organisationName: returnValues[1],
        });
      }
    });
  }, [contract]);

  useEffect(() => {
    if (contract == null) {
      return;
    }
    (async () => {
      const info = await contract.methods.getElectionInfo().call();
      setElectionInfo({
        electionName: info[0],
        organisationName: info[1],
      });
    })();
  }, [contract]);

  const createElection = useCallback(
    (electionName: string, organisationName: string) => {
      return contract?.methods
        .initElection(electionName, organisationName)
        .send({ from: currentAddress }) as PromiEvent<any>;
    },
    [contract?.methods, currentAddress]
  );

  const contextValue = useMemo(
    () => ({
      electionInfo,
      createElection,
    }),
    [createElection, electionInfo]
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
