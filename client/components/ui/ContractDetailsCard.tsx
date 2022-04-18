import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import Box from "@mui/material/Box";

import { useElection, useWeb3 } from "@providers/index";

const ContractDetailsCard = () => {
  const { contractAddress, currentNetworkType } = useWeb3();
  const { electionInfo, electionStatus, electionProgress } = useElection();

  return (
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
        </Box>
        <Box>
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
      </CardContent>
      <CardActions>
        <Button
          size="small"
          href={`https://${currentNetworkType}.etherscan.io/address/${contractAddress}`}
          target="_blank"
        >
          View on etherscan.io
        </Button>
      </CardActions>
    </Card>
  );
};

export default ContractDetailsCard;
