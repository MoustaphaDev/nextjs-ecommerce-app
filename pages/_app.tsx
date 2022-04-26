import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components";
import NextProgress from "next-progress";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextProgress delay={300} options={{ showSpinner: false }} />
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
