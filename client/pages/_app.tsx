import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { Footer, ResponsiveAppBar } from "@components/molecules";
import { Web3Provider, ElectionProvider } from "@providers/index";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Web3Provider>
        <ElectionProvider>
          <ResponsiveAppBar />
          <Component {...pageProps} />
          <Footer />
        </ElectionProvider>
      </Web3Provider>
    </LocalizationProvider>
  );
}

export default MyApp;
