import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const styles = {
  global: (props) => ({
    body: {
      color: mode("spotifyBlack", "white")(props),
      bg: mode("white", "spotifyBlack")(props),
    },
  }),
};

export default extendTheme({
  config: {
    // BUG: Doesn't work
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    spotifyDarkGreen: "#1DB954", // For non-hover links
    spotifyLightGreen: "#1ED760", // For on-hover links
    spotifyGrey: "#FFFFFF12",
    spotifyBlack: "#191414",
  },
  fonts: {
    heading: `Circular, sans-serif`,
    body: `Circular, sans-serif`,
    mono: `Circular, sans-serif`,
  },
  styles,
  // styles: {
  //   // makes chakra not override global.css' background color
  //   global: {
  //     body: {
  //       bg: "",
  //     },
  //   },
  // },
});
