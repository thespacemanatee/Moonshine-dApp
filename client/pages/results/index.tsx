import type { NextPage } from "next";
import Lottie from "react-lottie-player";

import {
  AdminElectionContainer,
  ResultContainer,
  VoterRegistrationContainer,
} from "@components/containers";
import { useElection, useWeb3 } from "@providers/index";
import Box from "@mui/material/Box";
import loadingAnim from "../../public/loading.json";
import Typography from "@mui/material/Typography";
import React from "react";

const Results: NextPage = () => {
  const { isLoading, isAdmin } = useWeb3();
  const { electionInfo, electionStatus, electionProgress, candidates } =
    useElection();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Lottie loop animationData={loadingAnim} play className="h-32 w-32" />
      </div>
    );
  }

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
