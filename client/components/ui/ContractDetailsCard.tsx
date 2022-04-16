import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useElection, useWeb3 } from "@providers/index";

const ContractDetailsCard = () => {
  const { contractAddress, currentNetworkType } = useWeb3();
  const { electionInfo } = useElection();

  return (
    <Card variant="outlined">
      <CardContent className="flex justify-between">
        <Box>
          <Typography className="text-sm" color="text.secondary" gutterBottom>
            Election Name
          </Typography>
          <Typography className="sm:xl flex-shrink font-medium lg:text-2xl">
            {electionInfo?.electionName ? electionInfo.electionName : "N/A"}
          </Typography>
          <Typography className="text-sm" color="text.secondary" gutterBottom>
            Organization
          </Typography>
          <Typography className="sm:xl flex-shrink font-medium lg:text-2xl">
            {electionInfo?.organisationName
              ? electionInfo.organisationName
              : "N/A"}
          </Typography>
        </Box>
        <Box>
          <Typography className="text-sm" color="text.secondary" gutterBottom>
            Contract Address
          </Typography>
          <Typography className="sm:xl flex-shrink font-medium lg:text-2xl">
            {contractAddress}
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
