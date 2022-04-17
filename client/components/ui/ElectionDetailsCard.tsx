import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { formatDuration, intervalToDuration } from "date-fns";

import { useElection } from "@providers/index";

const ElectionDetailsCard = () => {
  const [timeLeft, setTimeLeft] = useState("");

  const { electionStatus } = useElection();

  useEffect(() => {
    const interval = setInterval(() => {
      let duration = intervalToDuration({
        start: new Date(),
        end: electionStatus?.endTime ?? new Date(),
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
  }, [electionStatus?.endTime]);

  return (
    <Card>
      <CardContent>
        <Typography className="text-sm" color="text.secondary" gutterBottom>
          Time Left
        </Typography>
        <Typography variant="h6" gutterBottom>
          {electionStatus && electionStatus?.startTime.getTime() < Date.now()
            ? timeLeft
            : "N/A"}
        </Typography>
      </CardContent>
      <CardActions className="justify-center">
        <Button color="error" onClick={() => {}}>
          End election
        </Button>
      </CardActions>
    </Card>
  );
};

export default ElectionDetailsCard;
