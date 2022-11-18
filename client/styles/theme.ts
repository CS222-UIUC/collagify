import { extendTheme /*, theme as baseTheme*/ } from "@chakra-ui/react";

export default extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,
  colors: {
    spotifyGreenDark: "#1DB954", // For non-hover links
    spotifyGreenBright: "#1ED760", // For on-hover links
    spotifyBlack: "#191414",
  },
  fonts: {
    heading: `Gotham, sans-serif`,
    body: `Gotham, sans-serif`,
    mono: `Gotham, sans-serif`,
  },
  // Less boilerplate way?
  components: {
    Heading: {
      baseStyle: {
        color: "illiniBlue",
        fontWeight: 500,
      },
      variants: {
        hoverable: {
          _hover: { color: "illiniOrange" },
        },
        largeHero: {
          color: "white",
          fontSize: ["4xl", "5xl", "6xl"],
          fontWeight: "bold",
        },
        mediumHero: {
          color: "white",
          fontSize: ["3xl", "4xl", "5xl"],
          fontWeight: "bold",
        },
        smallHero: {
          color: "white",
          fontSize: ["2xl", "3xl", "4xl"],
          fontWeight: "bold",
        },
      },
    },
    Text: {
      baseStyle: {
        color: "illiniBlue",
      },
      variants: {
        hoverable: {
          _hover: { color: "illiniOrange" },
        },
        article: {
          fontSize: ["md", "lg", "xl"],
        },
      },
    },
    Link: {
      baseStyle: {
        color: "illiniBlue",
        _hover: { textDecoration: "none", color: "illiniOrange" },
      },
      variants: {
        underline: {
          color: "industrialBlue.300",
          textDecoration: "underline",
          _hover: { textDecoration: "underline", color: "illiniOrange" },
        },
      },
    },
    Divider: {
      baseStyle: {
        borderColor: "illiniBlue",
      },
    },
    Container: {
      baseStyle: {
        maxW: "container.lg",
        px: { base: "1em", md: "2em" },
      },
    },
    Button: {
      baseStyle: {
        rounded: "none",
        variant: "ghost",
        _hover: {
          textDecoration: "none",
          color: "illiniOrange",
          backgroundColor: "transparent",
        },
      },
    },
    IconButton: {
      baseStyle: {
        rounded: "none",
        variant: "ghost",
        bgColor: "transparent",
        color: "illiniBlue",
        _hover: {
          bgColor: "transparent",
          color: "illiniOrange",
        },
      },
    },
  },
});
