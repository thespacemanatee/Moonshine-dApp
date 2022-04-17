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
import TextField from "@mui/material/TextField";
import { format } from "date-fns";

const ResultContainer = () => {
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();

  const { electionInfo, electionStatus, electionProgress } = useElection();

  return (
    <div>
      <Typography className="text-sm" color="text.secondary" gutterBottom>
        Election Name
      </Typography>
      <Typography
        className="sm:xl flex-shrink font-medium lg:text-2xl"
        gutterBottom
      >
        {electionInfo?.electionName ? electionInfo.electionName : "N/A"}
      </Typography>
      <Typography className="text-sm" color="text.secondary" gutterBottom>
        Organization
      </Typography>
      <Typography
        className="sm:xl flex-shrink font-medium lg:text-2xl"
        gutterBottom
      >
        {electionInfo?.organisationName ? electionInfo.organisationName : "N/A"}
      </Typography>
      <Typography className="text-sm" color="text.secondary" gutterBottom>
        Start Time
      </Typography>
      <Typography
        className="sm:xl flex-shrink font-medium lg:text-2xl"
        gutterBottom
      >
        {electionStatus?.startTime
          ? format(electionStatus.startTime, "PPpp")
          : "N/A"}
      </Typography>
      <Typography className="text-sm" color="text.secondary" gutterBottom>
        End Time
      </Typography>
      <Typography
        className="sm:xl flex-shrink font-medium lg:text-2xl"
        gutterBottom
      >
        {electionStatus?.endTime
          ? format(electionStatus.endTime, "PPpp")
          : "N/A"}
      </Typography>
    </div>
  );
};

export default ResultContainer;
