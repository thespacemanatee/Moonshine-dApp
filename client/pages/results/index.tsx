import React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";

import { ResultContainer } from "@components/containers";
import { useElection } from "@providers/index";

const Results: NextPage = () => {
  const { electionProgress } = useElection();

  return (
    <Container maxWidth="xl" className="p-8">
      <ResultContainer />
    </Container>
  );
};

export default Results;
