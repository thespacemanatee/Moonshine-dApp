import React, { useState } from "react";
import Lottie from "react-lottie-player";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TransactionReceipt } from "web3-core";

import { CandidateResultsCard } from "@components/ui";
import { useElection, useWeb3 } from "@providers/index";

import pleaseWaitAnim from "../../public/please-wait.json";
import getReadyAnim from "../../public/get-ready.json";
import startVotingAnim from "../../public/start-voting.json";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import { CandidateInfo } from "types";

const ResultContainer = () => {
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] =
    useState<TransactionReceipt>();
  const { contractAddress, currentNetworkType } = useWeb3();
  const { electionInfo, electionStatus, electionProgress, candidates } =
    useElection();

  const sortedCandidates = (candidate: CandidateInfo[]) => {
    candidate.sort((n1, n2) => {
      if (n1.voteCount > n2.voteCount) return 1;
      if (n1.voteCount < n2.voteCount) return -1;
      return 0;
    });
    return candidate.reverse();
  };

  return (
    <div>
      if (!electionStatus.isTerminated
      <Card variant="outlined">
        <CardContent className="grid grid-cols-1 md:grid-cols-2">
          <Box>
            <Typography className="text-sm" color="text.secondary" gutterBottom>
              Election Name
            </Typography>
            <Typography variant="h6" gutterBottom>
              {electionInfo?.electionName ? electionInfo.electionName : "N/A"}
            </Typography>
            <Typography className="text-sm" color="text.secondary" gutterBottom>
              Organization
            </Typography>
            <Typography variant="h6" gutterBottom>
              {electionInfo?.organisationName
                ? electionInfo.organisationName
                : "N/A"}
            </Typography>
            <Typography className="text-sm" color="text.secondary" gutterBottom>
              Start Time
            </Typography>
            <Typography variant="h6" gutterBottom>
              {electionStatus?.startTime
                ? format(electionStatus.startTime, "PPpp")
                : "N/A"}
            </Typography>
            <Typography className="text-sm" color="text.secondary" gutterBottom>
              End Time
            </Typography>
            <Typography variant="h6" gutterBottom>
              {electionStatus?.endTime
                ? format(electionStatus.endTime, "PPpp")
                : "N/A"}
            </Typography>
            <Typography className="text-sm" color="text.secondary" gutterBottom>
              Contract Address
            </Typography>
            <Typography variant="h6" noWrap gutterBottom>
              {contractAddress}
            </Typography>
            <Typography className="text-sm" color="text.secondary" gutterBottom>
              Election Status
            </Typography>
            <Typography variant="h6" gutterBottom>
              {electionProgress}
            </Typography>
          </Box>
          <Box>
            <Typography className="text-sm" color="text.secondary" gutterBottom>
              Election Result
            </Typography>
            {sortedCandidates(candidates).map((candidate) => (
              <div key={candidate.id} className="px-4 py-2">
                <CandidateResultsCard
                  candidateName={candidate.candidateName}
                  slogan={candidate.slogan}
                  voteCount={candidate.voteCount}
                />
              </div>
            ))}
          </Box>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            href={`https:${currentNetworkType}.etherscan.io/address/${contractAddress}`}
            target="_blank"
          >
            View on etherscan.io
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default ResultContainer;
