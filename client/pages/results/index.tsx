import type { NextPage } from "next";
import Head from "next/head";
import Container from "@mui/material/Container";

import { ResultContainer } from "@components/containers";
import { useElection } from "@providers/index";

const Results: NextPage = () => {
  return (
    <Container maxWidth="xl" className="p-8">
      <Head>
        <title>Results</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ResultContainer />
    </Container>
  );
};

export default Results;
