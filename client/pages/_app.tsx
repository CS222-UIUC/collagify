// import "../styles/globals.css";
import theme from "../styles/theme";

// import styles from "../styles/_app.module.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} /*resetCSS={false}*/>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
