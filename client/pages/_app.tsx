import '../styles/globals.css'

import styles from "../styles/_app.module.css";
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, Box } from "@chakra-ui/react";
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {

  const theme = extendTheme({
    colors: {
      spotify: {
        green: "#1DB954",
        black: "#191414",
        white: "#FFFFFF",
      }
    }
  });

  return (
    <ChakraProvider theme={theme}>
      <Box bgColor="spotify.black">
        <header className={styles.navbar}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
        </header>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
