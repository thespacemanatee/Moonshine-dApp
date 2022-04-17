import React from "react";
import type { NextPage } from "next";

import { ResultContainer } from "@components/containers";
import { useElection, useWeb3 } from "@providers/index";
import Typography from "@mui/material/Typography";

const Results: NextPage = () => {
  const { isLoading, isAdmin } = useWeb3();
  const { electionInfo, electionStatus, electionProgress, candidates } =
    useElection();

  return (
    <div className="flex justify-center">
      <div className="w-4/5 min-w-fit p-8">
        {electionProgress === "Ended" ? (
          <ResultContainer />
        ) : (
          <Typography className="text-lg" color="text.primary" gutterBottom>
            This event is still ongoing, please check it again after it ends!
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Results;
