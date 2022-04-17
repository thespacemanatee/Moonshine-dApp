import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

type CandidateDetailsCardProps = {
  candidateId: number;
  candidateName: string;
  slogan: string;
  onVoteClicked?: (candidateId: number) => void;
};

const CandidateDetailsCard = ({
  candidateId,
  candidateName,
  slogan,
  onVoteClicked,
}: CandidateDetailsCardProps) => {
  return (
    <Card>
      <CardContent>
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
      </CardContent>
      {onVoteClicked ? (
        <CardActions>
          <Button
            onClick={() => {
              onVoteClicked(candidateId);
            }}
          >
            Vote
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
};

export default CandidateDetailsCard;
