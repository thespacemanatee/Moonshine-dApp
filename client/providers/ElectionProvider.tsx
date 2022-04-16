import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PromiEvent } from "web3-core";

import { useWeb3 } from "@providers/index";
import { CandidateInfo, ElectionInfo, ElectionStatus } from "types";
import { fromUnixTime } from "date-fns";

type ElectionContextProps = {
  electionInfo?: ElectionInfo;
  electionStatus?: ElectionStatus;
  candidates: CandidateInfo[];
  createElection: (
    electionName: string,
    organisationName: string
  ) => PromiEvent<any>;
  addCandidate: (candidateName: string, slogan: string) => PromiEvent<any>;
  startElection: (startTime: number, endTime: number) => PromiEvent<any>;
};

const ElectionContext = React.createContext<ElectionContextProps | null>(null);

type ElectionProviderProps = {
  children: React.ReactNode;
};

const ElectionProvider = ({ children }: ElectionProviderProps) => {
  const [electionInfo, setElectionInfo] = useState<ElectionInfo>();
  const [electionStatus, setElectionStatus] = useState<ElectionStatus>();
  const [candidates, setCandidates] = useState<CandidateInfo[]>([]);
  const { contract, currentAddress } = useWeb3();

  useEffect(() => {
    if (contract == null) {
      return;
    }
    (async () => {
      const tempInfo = await contract.methods.getElectionInfo().call();
      const tempStatus = await contract.methods.getElectionStatus().call();
      const tempCandidates = await contract.methods.getAllCandidates().call();
      setElectionInfo({
        electionName: tempInfo[0],
        organisationName: tempInfo[1],
        isInitialized: tempInfo[2],
      });
      setElectionStatus({
        startTime: fromUnixTime(tempStatus[0]),
        endTime: fromUnixTime(tempStatus[1]),
        isTerminated: tempStatus[2],
      });
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

  const startElection = useCallback(
    (startTime: number, endTime: number) => {
      return contract?.methods
        .startElection(startTime, endTime)
        .send({ from: currentAddress }) as PromiEvent<any>;
    },
    [contract?.methods, currentAddress]
  );

  const contextValue = useMemo(
    () => ({
      electionInfo,
      electionStatus,
      candidates,
      createElection,
      addCandidate,
      startElection,
    }),
    [
      addCandidate,
      candidates,
      createElection,
      electionInfo,
      electionStatus,
      startElection,
    ]
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
