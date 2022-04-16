import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useElection, useWeb3 } from "@providers/index";
import { format } from "date-fns";

enum ElectionProgress {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Ended = "Ended",
}

const ContractDetailsCard = () => {
  const [electionProgress, setElectioProgress] = useState(
    ElectionProgress.NotStarted
  );

  const { contractAddress, currentNetworkType } = useWeb3();
  const { electionInfo, electionStatus } = useElection();

  useEffect(() => {
    if (!electionStatus?.startTime && !electionStatus?.endTime) {
      return;
    }
    if (Date.now() - electionStatus.startTime.getTime() < 0) {
      setElectioProgress(ElectionProgress.NotStarted);
    } else if (Date.now() - electionStatus.endTime.getTime() > 0) {
      setElectioProgress(ElectionProgress.Ended);
    } else {
      setElectioProgress(ElectionProgress.InProgress);
    }
  }, [electionStatus?.endTime, electionStatus?.startTime]);

  return (
    <Card variant="outlined">
      <CardContent className="grid grid-cols-2">
        <Box>
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
            {electionInfo?.organisationName
              ? electionInfo.organisationName
              : "N/A"}
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
        </Box>
        <Box>
          <Typography className="text-sm" color="text.secondary" gutterBottom>
            Contract Address
          </Typography>
          <Typography
            className="sm:xl flex-shrink font-medium lg:text-2xl"
            gutterBottom
          >
            {contractAddress}
          </Typography>
          <Typography className="text-sm" color="text.secondary" gutterBottom>
            Election Status
          </Typography>
          <Typography
            className="sm:xl flex-shrink font-medium lg:text-2xl"
            gutterBottom
          >
            {electionProgress}
          </Typography>
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
  );
};

export default ContractDetailsCard;
