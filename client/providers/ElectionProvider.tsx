import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PromiEvent } from "web3-core";
import { fromUnixTime } from "date-fns";

import { useWeb3 } from "@providers/index";
import {
  CandidateInfo,
  ElectionInfo,
  ElectionProgress,
  ElectionStatus,
} from "types";

type ElectionContextProps = {
  electionInfo?: ElectionInfo;
  electionStatus?: ElectionStatus;
  electionProgress?: ElectionProgress;
  candidates: CandidateInfo[];
  createElection: (
    electionName: string,
    organisationName: string
  ) => PromiEvent<any>;
  addCandidate: (candidateName: string, slogan: string) => PromiEvent<any>;
  startElection: (startTime: number, endTime: number) => PromiEvent<any>;
  registerVoter: () => PromiEvent<any>;
};

const ElectionContext = React.createContext<ElectionContextProps | null>(null);

type ElectionProviderProps = {
  children: React.ReactNode;
};

const ElectionProvider = ({ children }: ElectionProviderProps) => {
  const [electionInfo, setElectionInfo] = useState<ElectionInfo>();
  const [electionStatus, setElectionStatus] = useState<ElectionStatus>();
  const [electionProgress, setElectionProgress] = useState<ElectionProgress>();
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
        isStarted: tempStatus[2],
        isTerminated: tempStatus[3],
      });
      if (!electionStatus?.startTime && !electionStatus?.endTime) {
        return;
      }
      if (tempInfo[2] === false) {
        setElectionProgress(ElectionProgress.NotCreated);
      } else if (
        (tempStatus[0] == 0 && tempStatus[1] == 0) ||
        Date.now() - electionStatus.startTime.getTime() < 0
      ) {
        setElectionProgress(ElectionProgress.NotStarted);
      } else if (Date.now() - electionStatus.endTime.getTime() > 0) {
        setElectionProgress(ElectionProgress.Ended);
      } else {
        setElectionProgress(ElectionProgress.InProgress);
      }
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
    contract.events.ElectionCreated((error: any, result: any) => {
      const returnValues = result.returnValues;
      console.log(error, returnValues);

      if (!error) {
        setElectionInfo({
          electionName: returnValues[0],
          organisationName: returnValues[1],
          isInitialized: returnValues[2],
        });
      }
    });
    contract.events.ElectionStarted((error: any, result: any) => {
      const returnValues = result.returnValues;
      console.log(error, returnValues);

      if (!error) {
        setElectionStatus({
          startTime: returnValues[0],
          endTime: returnValues[1],
          isStarted: returnValues[2],
          isTerminated: returnValues[3],
        });
      }
    });
  }, [
    candidates,
    contract,
    electionStatus?.endTime,
    electionStatus?.startTime,
  ]);

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

  const registerVoter = useCallback(() => {
    return contract?.methods
      .registerVoter()
      .send({ from: currentAddress }) as PromiEvent<any>;
  }, [contract?.methods, currentAddress]);

  const contextValue = useMemo(
    () => ({
      electionInfo,
      electionStatus,
      electionProgress,
      candidates,
      createElection,
      addCandidate,
      startElection,
      registerVoter,
    }),
    [
      addCandidate,
      candidates,
      createElection,
      electionInfo,
      electionProgress,
      electionStatus,
      registerVoter,
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
