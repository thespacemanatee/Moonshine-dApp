import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type CandidateDetailsCardProps = {
  candidateName: string;
  slogan: string;
};

const CandidateDetailsCard = ({
  candidateName,
  slogan,
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
    </Card>
  );
};

export default CandidateDetailsCard;
