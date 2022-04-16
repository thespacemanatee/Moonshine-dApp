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
  isRegistered: boolean;
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [candidates, setCandidates] = useState<CandidateInfo[]>([]);

  const getAndSetElectionProgress = (
    isStarted: boolean,
    startUnix: number,
    endUnix: number,
    startTime: Date,
    endTime: Date
  ) => {
    if (isStarted === false) {
      setElectionProgress(ElectionProgress.NotCreated);
    } else if (
      (startUnix === 0 && endUnix == 0) ||
      Date.now() - startTime.getTime() < 0
    ) {
      setElectionProgress(ElectionProgress.NotStarted);
    } else if (Date.now() - endTime.getTime() > 0) {
      setElectionProgress(ElectionProgress.Ended);
    } else {
      setElectionProgress(ElectionProgress.InProgress);
    }
  };

  const { contract, currentAddress } = useWeb3();
  useEffect(() => {
    if (contract == null) {
      return;
    }
    (async () => {
      const tempInfo = await contract.methods.getElectionInfo().call();
      const tempStatus = await contract.methods.getElectionStatus().call();
      const tempCandidates = await contract.methods.getAllCandidates().call();
      const tempRegistered = await contract.methods.getIsRegistered().call();
      setElectionInfo({
        electionName: tempInfo[0],
        organisationName: tempInfo[1],
        isInitialized: tempInfo[2],
      });
      const startUnix = tempStatus[0] as number;
      const startTime = fromUnixTime(tempStatus[0]);
      const endUnix = tempStatus[1] as number;
      const endTime = fromUnixTime(tempStatus[1]);
      const isStarted = tempStatus[2] as boolean;
      const isTerminated = tempStatus[3] as boolean;
      setElectionStatus({
        startTime,
        endTime,
        isStarted,
        isTerminated,
      });
      setIsRegistered(tempRegistered);
      getAndSetElectionProgress(
        isStarted,
        startUnix,
        endUnix,
        startTime,
        endTime
      );
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
  }, [contract]);

  useEffect(() => {
    const electionCreatedEmitter = contract?.events
      .ElectionCreated(() => {})
      .on("data", (result: any) => {
        const returnValues = result.returnValues;
        setElectionInfo({
          electionName: returnValues[0],
          organisationName: returnValues[1],
          isInitialized: returnValues[2],
        });
      });
    const addCandidateEmitter = contract?.events
      .CandidateAdded(() => {})
      .on("data", (result: any) => {
        const returnValues = result.returnValues;
        setCandidates((candidates) => [
          ...candidates,
          {
            id: returnValues[0],
            candidateName: returnValues[1],
            slogan: returnValues[2],
            voteCount: returnValues[3],
          },
        ]);
      });
    const electionStartedEmitter = contract?.events
      .ElectionStarted(() => {})
      .on("data", (result: any) => {
        const returnValues = result.returnValues;
        const startUnix = returnValues[0] as number;
        const startTime = fromUnixTime(startUnix);
        const endUnix = returnValues[1] as number;
        const endTime = fromUnixTime(endUnix);
        const isStarted = returnValues[2] as boolean;
        const isTerminated = returnValues[3] as boolean;
        setElectionStatus({
          startTime,
          endTime,
          isStarted,
          isTerminated,
        });
        getAndSetElectionProgress(
          isStarted,
          startUnix,
          endUnix,
          startTime,
          endTime
        );
      });
    return () => {
      electionCreatedEmitter?.removeAllListeners();
      addCandidateEmitter?.removeAllListeners();
      electionStartedEmitter?.removeAllListeners();
    };
  }, [contract?.events]);

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
      isRegistered,
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
      isRegistered,
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
