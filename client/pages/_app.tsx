import '../styles/globals.css'

import styles from "../styles/_app.module.css";
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, Box } from "@chakra-ui/react";
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {

  const theme = extendTheme({
    colors: {
      spotifyGreen: "#1DB954"
    },
    styles: {
      // makes chakra not override global.css' background color
      global: {
        body: {
          color: "",
          bg: "",
        },
      }
    },
  });

  return (
    <ChakraProvider theme={theme} resetCSS={false}>
      <header className={styles.navbar}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
      </header>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
