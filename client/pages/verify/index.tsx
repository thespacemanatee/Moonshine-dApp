import type { NextPage } from "next";
import Head from "next/head";
import Container from "@mui/material/Container";

import { AdminVerifyContainer } from "@components/containers";

const Verify: NextPage = () => {
  return (
    <Container maxWidth="xl" className="p-8">
      <Head>
        <title>Verify | Moonshine</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminVerifyContainer />
    </Container>
  );
};

export default Verify;
