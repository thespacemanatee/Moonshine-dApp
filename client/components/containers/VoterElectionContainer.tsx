import React, { useState } from "react";
import Lottie from "react-lottie-player";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { TransactionReceipt } from "web3-core";

import { CandidateDetailsCard, ContractDetailsCard } from "@components/ui";
import { useElection } from "@providers/index";
import { ElectionProgress } from "types";

import pleaseWaitAnim from "../../public/please-wait.json";
import getReadyAnim from "../../public/get-ready.json";
import startVotingAnim from "../../public/start-voting.json";
import shakeHandsAnim from "../../public/shake-hands.json";

const STAGES = {
  [ElectionProgress.NotCreated]: {
    title: "Please wait for the election to be created!",
    animation: pleaseWaitAnim,
  },
  [ElectionProgress.NotStarted]: {
    title: "Get ready! Election starting soon...",
    animation: getReadyAnim,
  },
  [ElectionProgress.InProgress]: {
    title: "Election is open for voting!",
    animation: startVotingAnim,
  },
  [ElectionProgress.Ended]: {
    title: "Election ended! Thank you for participating!",
    animation: shakeHandsAnim,
  },
};

const VoterRegistrationContainer = () => {
  const [isSending, setIsSending] = useState(false);

  const { electionProgress, currentVoter, candidates, registerVoter, vote } =
    useElection();

  const handleRegisterVoter = () => {
    registerVoter()
      .once("sending", () => {
        setIsSending(true);
      })
      .then((receipt: TransactionReceipt) => {
        console.log("Registered as voter! Receipt:", receipt);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleVote = (candidateId: number) => {
    vote(candidateId)
      .once("sending", () => {
        setIsSending(true);
      })
      .then((receipt: TransactionReceipt) => {
        console.log(`Voted for candidate ${candidateId}! Receipt:`, receipt);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <Box>
      <ContractDetailsCard />
      <Box className="my-12 flex flex-col items-center">
        {electionProgress ? (
          <Box className="flex flex-col items-center">
            <Typography variant="h5" gutterBottom>
              {STAGES[electionProgress].title}
            </Typography>
            <Lottie
              loop
              animationData={STAGES[electionProgress].animation}
              play
              className="h-64 w-64"
            />
          </Box>
        ) : null}
        {!currentVoter?.isRegistered && (
          <Button
            variant="outlined"
            disabled={
              electionProgress === ElectionProgress.NotCreated ||
              electionProgress === ElectionProgress.Ended ||
              isSending
            }
            onClick={handleRegisterVoter}
          >
            Register
          </Button>
        )}
      </Box>
      {currentVoter?.isRegistered && !currentVoter.isVerified && (
        <Box className="flex flex-col items-center">
          <CircularProgress />
          <Typography variant="h6" gutterBottom className="my-12">
            You have registered as a voter! Please wait for admin
            verification...
          </Typography>
        </Box>
      )}
      {currentVoter?.isVerified && electionProgress !== ElectionProgress.Ended && (
        <Box className="flex flex-col">
          <Typography variant="h6" className="self-center" gutterBottom>
            You have been verified!
          </Typography>
          <Box className="my-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {candidates.map((candidate) => (
              <CandidateDetailsCard
                key={candidate.id}
                candidateId={candidate.id}
                candidateName={candidate.candidateName}
                slogan={candidate.slogan}
                onVoteClicked={handleVote}
                disabled={currentVoter.hasVoted}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VoterRegistrationContainer;
