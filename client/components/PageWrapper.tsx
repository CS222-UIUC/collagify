import { Flex, Spacer } from "@chakra-ui/react";
import Head from "next/head";
import Footer from "./Footer";
import NavBar from "./NavBar";

type PageWrapperProps = {
  readonly subtitle: string;
  readonly children?: React.ReactNode;
};

export default function PageWrapper({ subtitle, children }: PageWrapperProps) {
  return (
    <>
      <Head key="PageWrapper">
        <title>{"Collagify" + (subtitle ? " | " + subtitle : "")}</title>
      </Head>
      <Flex direction="column" minH="100vh">
        <NavBar />
        {children}
        <Spacer />
        <Footer />
      </Flex>
    </>
  );
}
