import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PromiEvent } from "web3-core";

import { useWeb3 } from "@providers/index";
import { CandidateInfo, ElectionInfo } from "types";

type ElectionContextProps = {
  electionInfo?: ElectionInfo;
  candidates: CandidateInfo[];
  createElection: (
    electionName: string,
    organisationName: string
  ) => PromiEvent<any>;
  addCandidate: (candidateName: string, slogan: string) => PromiEvent<any>;
};

const ElectionContext = React.createContext<ElectionContextProps | null>(null);

type ElectionProviderProps = {
  children: React.ReactNode;
};

const ElectionProvider = ({ children }: ElectionProviderProps) => {
  const [electionInfo, setElectionInfo] = useState<ElectionInfo>();
  const [candidates, setCandidates] = useState<CandidateInfo[]>([]);
  const { contract, currentAddress } = useWeb3();

  useEffect(() => {
    if (contract == null) {
      return;
    }
    (async () => {
      const tempInfo = await contract.methods.getElectionInfo().call();
      const tempCandidates = await contract.methods.getAllCandidates().call();
      if (tempCandidates) {
        const processed = (tempCandidates[0] as string[])?.map((_, index) => {
          const tempCandidate: CandidateInfo = {
            id: tempCandidates[0][index],
            candidateName: tempCandidates[1][index],
            slogan: tempCandidates[2][index],
            voteCount: tempCandidates[3][index],
          };
          return tempCandidate;
        });
        setElectionInfo({
          electionName: tempInfo[0],
          organisationName: tempInfo[1],
        });
        setCandidates(processed);
      }
    })();
  }, [candidates, contract]);

  const createElection = useCallback(
    (electionName: string, organisationName: string) => {
      return contract?.methods
        .initElection(electionName, organisationName)
        .send({ from: currentAddress }) as PromiEvent<any>;
    },
    [contract?.methods, currentAddress]
  );

  const addCandidate = useCallback(
    (candidateName: string, slogan: string) => {
      return contract?.methods
        .addCandidate(candidateName, slogan)
        .send({ from: currentAddress }) as PromiEvent<any>;
    },
    [contract?.methods, currentAddress]
  );

  const contextValue = useMemo(
    () => ({
      electionInfo,
      candidates,
      createElection,
      addCandidate,
    }),
    [addCandidate, candidates, createElection, electionInfo]
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
