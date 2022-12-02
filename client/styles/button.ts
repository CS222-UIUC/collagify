import { lighten, getColor, mode } from "@chakra-ui/theme-tools";

export const ButtonTheme = {
  colors: {
    userSelected: {},
  },
  components: {
    Button: {
      baseStyle: {
        ">.chakra-button__icon": {
          fontSize: "24px",
        },
      },
      variants: {
        solid: (props) => {
          const { colorScheme } = props;

          if (colorScheme !== "rebeccapurple") {
            return {};
          }

          return {
            bgColor: lighten("rebeccapurple", 15),
            _hover: {
              bgColor: "rebeccapurple",
            },
          };
        },
        gradient: (props) => {
          const { theme, fromcolor, tocolor } = props;
          const lgFrom = getColor(theme, fromcolor);
          const lgTo = getColor(theme, tocolor);
          const bgColor = getColor(theme, mode("white", "gray.800")(props));

          return {
            border: "3px solid",
            borderColor: "transparent",
            borderRadius: "full",
            background: `linear-gradient(${bgColor}, ${bgColor}) padding-box, 
            linear-gradient(135deg, ${lgFrom}, ${lgTo}) border-box`,
            "> *": {
              background: `linear-gradient(135deg, ${lgFrom}, ${lgTo})`,
              backgroundClip: "text",
              textFillColor: "transparent",
            },
            _hover: {
              background: `linear-gradient(${bgColor}, ${bgColor}) padding-box, 
              linear-gradient(315deg, ${lgFrom}, ${lgTo}) border-box`,
              "> *": {
                background: `linear-gradient(315deg, ${lgFrom}, ${lgTo})`,
                backgroundClip: "text",
              },
            },
          };
        },
      },
    },
  },
};
