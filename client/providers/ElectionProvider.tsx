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
  VoterInfo,
} from "types";

type ElectionContextProps = {
  electionInfo?: ElectionInfo;
  electionStatus?: ElectionStatus;
  electionProgress?: ElectionProgress;
  isRegistered: boolean;
  candidates: CandidateInfo[];
  voters: VoterInfo[];
  createElection: (
    electionName: string,
    organisationName: string
  ) => PromiEvent<any>;
  addCandidate: (candidateName: string, slogan: string) => PromiEvent<any>;
  startElection: (startTime: number, endTime: number) => PromiEvent<any>;
  registerVoter: () => PromiEvent<any>;
  verifyVoter: (address: string) => PromiEvent<any>;
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
  const [voters, setVoters] = useState<VoterInfo[]>([]);

  const getAndSetElectionProgress = (
    isInitialized: boolean,
    startUnix: number,
    endUnix: number,
    startTime: Date,
    endTime: Date
  ) => {
    if (isInitialized === false) {
      setElectionProgress(ElectionProgress.NotCreated);
    } else if (
      (startUnix === 0 && endUnix === 0) ||
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
      const tempVoters = await contract.methods.getAllVoters().call();
      const electionName = tempInfo[0];
      const organisationName = tempInfo[1];
      const isInitialized = tempInfo[2];
      setElectionInfo({
        electionName,
        organisationName,
        isInitialized,
      });
      const startUnix = parseInt(tempStatus[0]);
      const startTime = fromUnixTime(startUnix);
      const endUnix = parseInt(tempStatus[1]);
      const endTime = fromUnixTime(endUnix);
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
        isInitialized,
        startUnix,
        endUnix,
        startTime,
        endTime
      );
      if (tempCandidates) {
        const ids = tempCandidates[0] as number[];
        const names = tempCandidates[1] as string[];
        const slogans = tempCandidates[2] as string[];
        const voteCounts = tempCandidates[3] as number[];
        const processed = ids.map((_, index) => {
          const tempCandidate: CandidateInfo = {
            id: ids[index],
            candidateName: names[index],
            slogan: slogans[index],
            voteCount: voteCounts[index],
          };
          return tempCandidate;
        });
        setCandidates(processed);
      }
      if (tempVoters) {
        const addresses = tempVoters[0] as string[];
        const isRegistereds = tempVoters[1] as boolean[];
        const isVerifieds = tempVoters[2] as boolean[];
        const hasVoteds = tempVoters[3] as boolean[];
        const processed = addresses.map((_, index) => {
          const tempVoter: VoterInfo = {
            address: addresses[index],
            isRegistered: isRegistereds[index],
            isVerified: isVerifieds[index],
            hasVoted: hasVoteds[index],
          };
          return tempVoter;
        });
        setVoters(processed);
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
        const startUnix = parseInt(returnValues[0]);
        const startTime = fromUnixTime(startUnix);
        const endUnix = parseInt(returnValues[1]);
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
    const voterRegisteredEmitter = contract?.events
      .VoterRegistered(() => {})
      .on("data", (result: any) => {
        const returnValues = result.returnValues;
        const address = returnValues[0];
        const isRegistered = returnValues[1];
        const isVerified = returnValues[2];
        const hasVoted = returnValues[3];
        setVoters((voters) => [
          ...voters,
          { address, isRegistered, isVerified, hasVoted },
        ]);
      });
    const voterVerifiedEmitter = contract?.events
      .VoterVerified(() => {})
      .on("data", (result: any) => {
        console.log(result);

        const returnValues = result.returnValues;
        const address = returnValues[0];
        setVoters((voters) => {
          const temp = [...voters];
          const voterIndex = temp.findIndex((v) => v.address === address);
          if (voterIndex !== -1) {
            temp[voterIndex] = { ...temp[voterIndex], isVerified: true };
          }
          return temp;
        });
      });
    return () => {
      electionCreatedEmitter?.removeAllListeners("data");
      addCandidateEmitter?.removeAllListeners("data");
      electionStartedEmitter?.removeAllListeners("data");
      voterRegisteredEmitter?.removeAllListeners("data");
      voterVerifiedEmitter?.removeAllListeners("data");
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

  const verifyVoter = useCallback(
    (address: string) => {
      return contract?.methods
        .verifyVoter(address)
        .send({ from: currentAddress }) as PromiEvent<any>;
    },
    [contract?.methods, currentAddress]
  );

  const contextValue = useMemo(
    () => ({
      electionInfo,
      electionStatus,
      electionProgress,
      isRegistered,
      candidates,
      voters,
      createElection,
      addCandidate,
      startElection,
      registerVoter,
      verifyVoter,
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
      verifyVoter,
      voters,
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
