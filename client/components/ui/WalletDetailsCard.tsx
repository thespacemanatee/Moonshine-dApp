import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useWeb3 } from "@providers/index";

const WalletDetailsCard = () => {
  const { currentAddress, currentBalance, currentNetworkType } = useWeb3();

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography className="text-sm" color="text.secondary" gutterBottom>
          Wallet Details
        </Typography>
        <Typography
          className="sm:xl flex-shrink font-medium lg:text-2xl"
          gutterBottom
        >
          {currentAddress}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {`Balance`}
        </Typography>
        <Typography
          className="sm:xl flex-shrink font-medium lg:text-2xl"
          gutterBottom
        >
          {`${currentBalance} wei`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          href={`https:${currentNetworkType}.etherscan.io/address/${currentAddress}`}
          target="_blank"
        >
          View on etherscan.io
        </Button>
      </CardActions>
    </Card>
  );
};

export default WalletDetailsCard;
