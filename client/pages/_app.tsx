import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { Web3Provider } from "@providers/Web3Provider";
import { Footer, ResponsiveAppBar } from "@components/molecules";
import { ElectionProvider } from "providers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Web3Provider>
        <ElectionProvider>
          <div className="h-screen">
            <ResponsiveAppBar />
            <Component {...pageProps} />
            <Footer />
          </div>
        </ElectionProvider>
      </Web3Provider>
    </LocalizationProvider>
  );
}

export default MyApp;
