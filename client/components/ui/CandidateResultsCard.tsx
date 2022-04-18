import React, { useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Lottie from "react-lottie-player";
import "react-circular-progressbar/dist/styles.css";

import partyAnim from "../../public/party.json";

type CandidateDetailsCardProps = {
  candidateName: string;
  slogan: string;
  voteCount: number;
  totalVotes: number;
  isWinner: boolean;
};

const CandidateResultsCard = ({
  candidateName,
  slogan,
  voteCount,
  totalVotes,
  isWinner,
}: CandidateDetailsCardProps) => {
  const percentage = useMemo(
    () => (voteCount / totalVotes) * 100,
    [totalVotes, voteCount]
  );

  return (
    <Card>
      <CardContent className="flex items-center">
        <Box className="w-full">
          <Typography className="text-sm" color="text.secondary" gutterBottom>
            Candidate Name
          </Typography>
          <Typography variant="h6" gutterBottom>
            {candidateName}
          </Typography>
          <Typography className="text-sm" color="text.secondary" gutterBottom>
            Candidate Slogan
          </Typography>
          <Typography variant="h6" gutterBottom>
            {slogan}
          </Typography>
          <Typography className="text-sm" color="text.secondary" gutterBottom>
            Vote Count
          </Typography>
          <Typography variant="h6" gutterBottom>
            {voteCount}
          </Typography>
        </Box>
        <CircularProgressbar
          className="h-48 w-48"
          value={percentage}
          text={`${Math.round(percentage)}%`}
          styles={buildStyles({
            rotation: 0.25,
            strokeLinecap: "butt",
            textSize: "16px",
            pathTransitionDuration: 0.5,
            pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
            textColor: "#f88",
            trailColor: "#d6d6d6",
            backgroundColor: "#3e98c7",
          })}
        />
        {isWinner && (
          <Lottie
            loop
            animationData={partyAnim}
            play
            className="absolute h-64 w-64"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateResultsCard;
