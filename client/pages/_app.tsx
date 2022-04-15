import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3Provider } from "@providers/Web3Provider";
import { ResponsiveAppBar } from "components/molecules";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <ResponsiveAppBar />
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;
