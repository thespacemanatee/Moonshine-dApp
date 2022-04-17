import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { TransactionReceipt } from "web3-core";
import { formatDuration, intervalToDuration } from "date-fns";

import { useElection } from "@providers/index";
import { ElectionProgress } from "types";

const ElectionDetailsCard = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { electionStatus, electionProgress, endElection } = useElection();

  const handleEndElection = () => {
    endElection()
      .once("sending", () => {
        setIsSending(true);
      })
      .then((receipt: TransactionReceipt) => {
        console.log("Election ended! Receipt:", receipt);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  useEffect(() => {
    if (!electionStatus || electionProgress !== ElectionProgress.InProgress) {
      setTimeLeft("");
      return;
    }
    const interval = setInterval(() => {
      let duration = intervalToDuration({
        start: new Date(),
        end: electionStatus.endTime,
      });

      setTimeLeft(
        formatDuration(duration, {
          delimiter: ", ",
        })
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [electionProgress, electionStatus, electionStatus?.endTime]);

  return (
    <Card>
      <CardContent>
        <Typography className="text-sm" color="text.secondary" gutterBottom>
          Time Left
        </Typography>
        <Typography variant="h6" gutterBottom>
          {timeLeft ? timeLeft : "No election in progress!"}
        </Typography>
      </CardContent>
      <CardActions className="justify-center">
        <Button
          color="error"
          onClick={handleEndElection}
          disabled={!timeLeft || isSending}
        >
          End election
        </Button>
      </CardActions>
    </Card>
  );
};

export default ElectionDetailsCard;
