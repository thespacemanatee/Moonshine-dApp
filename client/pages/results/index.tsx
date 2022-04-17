import React from "react";
import type { NextPage } from "next";

import { ResultContainer } from "@components/containers";
import { useElection } from "@providers/index";

const Results: NextPage = () => {
  const { electionProgress } = useElection();

  return (
    <div className="flex justify-center">
      <div className="w-4/5 min-w-fit p-8">
        <ResultContainer />
      </div>
    </div>
  );
};

export default Results;
