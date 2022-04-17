import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

type CandidateDetailsCardProps = {
  candidateId: string;
  candidateName: string;
  slogan: string;
  onVoteClicked?: (candidateId: string) => void;
  disabled?: boolean;
};

const CandidateDetailsCard = ({
  candidateId,
  candidateName,
  slogan,
  onVoteClicked,
  disabled,
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
            disabled={disabled}
          >
            Vote
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
};

export default CandidateDetailsCard;
