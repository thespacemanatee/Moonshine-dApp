import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useEffect } from "react";

import { useWeb3 } from "@providers/index";
import { ResponsiveAppBar } from "@components/molecules";

const Home: NextPage = () => {
  return (
    <div>
      <ResponsiveAppBar />
    </div>
  );
};

export default Home;
