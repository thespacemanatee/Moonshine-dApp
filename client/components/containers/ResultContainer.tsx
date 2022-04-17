import React, { useState } from "react";
import Box from "@mui/material/Box";

import { CandidateResultsCard, ContractDetailsCard } from "@components/ui";
import { useElection } from "@providers/index";
import { CandidateInfo } from "types";

const sortedCandidates = (candidate: CandidateInfo[]) => {
  candidate.sort((n1, n2) => {
    if (n1.voteCount > n2.voteCount) return 1;
    if (n1.voteCount < n2.voteCount) return -1;
    return 0;
  });
  return candidate.reverse();
};

const ResultContainer = () => {
  const [isSending, setIsSending] = useState(false);
  const { electionInfo, electionStatus, electionProgress, candidates } =
    useElection();

  return (
    <Box>
      <ContractDetailsCard />
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
    </Box>
  );
};

export default ResultContainer;
