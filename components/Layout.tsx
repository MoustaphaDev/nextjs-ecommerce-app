import Head from "next/head";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="layout">
      <Head>
        <title>JS MASTERY STORE</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
