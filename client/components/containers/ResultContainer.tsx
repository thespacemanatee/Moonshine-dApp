import React from "react";
import Lottie from "react-lottie-player";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CandidateResultsCard, ContractDetailsCard } from "@components/ui";
import { useElection } from "@providers/index";
import { CandidateInfo, ElectionProgress } from "types";

import inProgressAnim from "../../public/in-progress.json";

const sortedCandidates = (candidate: CandidateInfo[]) => {
  candidate.sort((n1, n2) => {
    if (n1.voteCount > n2.voteCount) return 1;
    if (n1.voteCount < n2.voteCount) return -1;
    return 0;
  });
  return candidate.reverse();
};

const ResultContainer = () => {
  const { candidates, electionProgress } = useElection();

  return (
    <Box>
      <ContractDetailsCard />
      {electionProgress === ElectionProgress.Ended && (
        <Box className="my-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {sortedCandidates(candidates).map((candidate) => (
            <CandidateResultsCard
              key={candidate.id}
              candidateName={candidate.candidateName}
              slogan={candidate.slogan}
              voteCount={candidate.voteCount}
            />
          ))}
        </Box>
      )}
      <Box className="my-12 flex flex-col items-center">
        <Typography variant="h5" gutterBottom>
          {electionProgress === ElectionProgress.InProgress
            ? "Election is in progress, please come back later!"
            : "Election has not been created/started!"}
        </Typography>
        <Lottie
          loop
          animationData={inProgressAnim}
          play
          className="h-64 w-64"
        />
      </Box>
    </Box>
  );
};

export default ResultContainer;
