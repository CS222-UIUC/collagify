import { extendTheme /*, theme as baseTheme*/ } from "@chakra-ui/react";

export default extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,
  colors: {
    spotifyDarkGreen: "#1DB954", // For non-hover links
    spotifyLightGreen: "#1ED760", // For on-hover links
    spotifyBlack: "#191414",
  },
  fonts: {
    heading: `Gotham, sans-serif`,
    body: `Gotham, sans-serif`,
    mono: `Gotham, sans-serif`,
  },
  styles: {
    // makes chakra not override global.css' background color
    global: {
      body: {
        bg: "",
      },
    },
  },
  // Less boilerplate way?
  components: {
    Button: {
      baseStyle: {
        _hover: {
          color: "spotifyBlack",
          backgroundColor: "spotifyLightGreen",
        },
      },
    },
  },
});
