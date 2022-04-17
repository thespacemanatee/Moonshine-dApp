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
  vote: (candidateId: number) => PromiEvent<any>;
  endElection: () => PromiEvent<any>;
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
  const [isVerified, setIsVerified] = useState(false);
  const [candidates, setCandidates] = useState<CandidateInfo[]>([]);
  const [voters, setVoters] = useState<VoterInfo[]>([]);

  const { contract, currentAddress } = useWeb3();

  const getAndSetElectionProgress = (
    isInitialized: boolean,
    isTerminated: boolean,
    startUnix: number,
    endUnix: number,
    startTime: Date,
    endTime: Date
  ) => {
    if (isInitialized === false) {
      setElectionProgress(ElectionProgress.NotCreated);
      return;
    }
    if (isTerminated) {
      setElectionProgress(ElectionProgress.Ended);
      return;
    }
    if (
      (startUnix === 0 && endUnix === 0) ||
      Date.now() - startTime.getTime() < 0
    ) {
      setElectionProgress(ElectionProgress.NotStarted);
      return;
    }
    if (Date.now() - endTime.getTime() > 0) {
      setElectionProgress(ElectionProgress.Ended);
      return;
    }
    setElectionProgress(ElectionProgress.InProgress);
  };

  useEffect(() => {
    const currentVoter = voters.find(
      (voter) => voter.address.toLowerCase() === currentAddress?.toLowerCase()
    );

    if (currentVoter) {
      setIsRegistered(true);
      setIsVerified(currentVoter.isVerified);
    } else {
      setIsRegistered(false);
      setIsVerified(false);
    }
  }, [currentAddress, voters]);

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
        isTerminated,
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
        console.log(result);
        const returnValues = result.returnValues;
        setElectionInfo({
          electionName: returnValues[0],
          organisationName: returnValues[1],
          isInitialized: returnValues[2],
        });
        setElectionProgress(ElectionProgress.NotStarted);
      });
    const addCandidateEmitter = contract?.events
      .CandidateAdded(() => {})
      .on("data", (result: any) => {
        console.log(result);
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
        console.log(result);
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
          isTerminated,
          startUnix,
          endUnix,
          startTime,
          endTime
        );
      });
    const voterRegisteredEmitter = contract?.events
      .VoterRegistered(() => {})
      .on("data", (result: any) => {
        console.log(result);
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
    const electionEndedEmitter = contract?.events
      .ElectionEnded(() => {})
      .on("data", (result: any) => {
        console.log(result);
        setElectionStatus((electionStatus) => {
          if (electionStatus) {
            return {
              ...electionStatus,
              isTerminated: true,
            };
          }
        });
        setElectionProgress(ElectionProgress.Ended);
      });
    return () => {
      electionCreatedEmitter?.removeAllListeners("data");
      addCandidateEmitter?.removeAllListeners("data");
      electionStartedEmitter?.removeAllListeners("data");
      voterRegisteredEmitter?.removeAllListeners("data");
      voterVerifiedEmitter?.removeAllListeners("data");
      electionEndedEmitter?.removeAllListeners("data");
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

  const vote = useCallback(
    (candidateId: number) => {
      return contract?.methods
        .vote(candidateId)
        .send({ from: currentAddress }) as PromiEvent<any>;
    },
    [contract?.methods, currentAddress]
  );

  const endElection = useCallback(() => {
    return contract?.methods
      .endElection()
      .send({ from: currentAddress }) as PromiEvent<any>;
  }, [contract?.methods, currentAddress]);

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
      vote,
      endElection,
    }),
    [
      addCandidate,
      candidates,
      createElection,
      electionInfo,
      electionProgress,
      electionStatus,
      endElection,
      isRegistered,
      registerVoter,
      startElection,
      verifyVoter,
      vote,
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
