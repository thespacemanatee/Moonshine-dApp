import type { NextPage } from "next";
import Head from "next/head";
import Lottie from "react-lottie-player";
import Container from "@mui/material/Container";

import {
  AdminElectionContainer,
  VoterRegistrationContainer,
} from "@components/containers";
import { useWeb3 } from "@providers/index";

import loadingAnim from "../public/loading.json";

const Home: NextPage = () => {
  const { isLoading, isAdmin } = useWeb3();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Lottie loop animationData={loadingAnim} play className="h-32 w-32" />
      </div>
    );
  }

  return (
    <Container maxWidth="xl" className="p-8">
      <Head>
        <title>Election</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {isAdmin ? <AdminElectionContainer /> : <VoterRegistrationContainer />}
    </Container>
  );
};

export default Home;
