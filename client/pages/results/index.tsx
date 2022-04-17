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
    <div className="flex flex-1 justify-center">
      <div className="w-4/5 min-w-fit">
        <div className="my-12">
          {electionProgress === "Ended" ? (
            <ResultContainer />
          ) : (
            <Typography className="text-lg" color="text.primary" gutterBottom>
              This event is still ongoing, please check it again after it ends!
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
