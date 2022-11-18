// import "../styles/globals.css";
import theme from "../styles/theme";

// import styles from "../styles/_app.module.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Link from "next/link"; // TODO: integrate with Chakra Link

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} resetCSS={false}>
      <header /*className={styles.navbar}*/>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </header>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
