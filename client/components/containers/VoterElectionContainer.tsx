import React, { useState } from "react";
import Lottie from "react-lottie-player";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TransactionReceipt } from "web3-core";

import { ContractDetailsCard } from "@components/ui";
import { useElection } from "@providers/index";
import { ElectionProgress } from "types";

import pleaseWaitAnim from "../../public/please-wait.json";
import getReadyAnim from "../../public/get-ready.json";
import startVotingAnim from "../../public/start-voting.json";

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
    animation: getReadyAnim,
  },
};

const VoterRegistrationContainer = () => {
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();

  const { electionProgress, registerVoter, isRegistered } = useElection();

  const handleRegisterVoter = () => {
    registerVoter()
      .once("sending", () => {
        setIsSending(true);
      })
      .once("transactionHash", (hash: string) => {
        setTransactionHash(hash);
      })
      .then((receipt: TransactionReceipt) => {
        console.log("Registered as voter! Receipt:", receipt);
        setTransactionReceipt(receipt);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div>
      <ContractDetailsCard />
      <div className="my-12 flex flex-col items-center">
        {electionProgress ? (
          <>
            <Typography variant="h5" gutterBottom>
              {STAGES[electionProgress].title}
            </Typography>
            <Lottie
              loop
              animationData={STAGES[electionProgress].animation}
              play
              className="h-64 w-64"
            />
          </>
        ) : null}
        <Button
          variant="outlined"
          disabled={
            electionProgress === ElectionProgress.NotCreated ||
            electionProgress === ElectionProgress.Ended ||
            isRegistered
          }
          onClick={handleRegisterVoter}
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default VoterRegistrationContainer;
