import {
  ComponentStyleConfig,
  extendTheme,
  ThemeConfig,
} from "@chakra-ui/react";
import type { GlobalStyleProps } from "@chakra-ui/theme-tools";

export const MAX_WIDTH = 1240;
export const PADDING_X = "160px";
export const PADDING_X_MB = "10px";

export const FONT_WEIGHT = {
  BOLD: "bold",
  MEDIUM: 500,
  SEMI: 700,
  NORMAL: "normal",
};

export const FONT_SIZE = {
  HEADER: "60px",
  SUB_HEADER: "40px",
  BODY: "16px",
};

const textStyles = {
  titleBold: {
    fontSize: FONT_SIZE.HEADER,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: "110%",
    fontFamily: `'Manrope', sans-serif`,
  },
  titleSemi: {
    fontSize: FONT_SIZE.SUB_HEADER,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: "110%",
    fontFamily: `'Manrope', sans-serif`,
  },
  bodyBold: {
    fontWeight: FONT_WEIGHT.BOLD,
    fontSize: FONT_SIZE.BODY,
    fontFamily: `'Manrope', sans-serif`,
  },
  bodyNormal: {
    fontWeight: FONT_WEIGHT.NORMAL,
    fontSize: FONT_SIZE.BODY,
    fontFamily: "Manrope",
  },
  bodyMedium: {
    fontWeight: FONT_WEIGHT.MEDIUM,
    fontSize: FONT_SIZE.BODY,
    fontFamily: "Manrope",
  },
};

export type TextStyles = typeof textStyles;

export default textStyles;

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  bg: {
    primary: "#0047B8",
    secondary: "#0E1E45",
    tertiary: "#151D14",
  },
  color: {
    white: "#ffffff",
    primary: "#0047B8",
    secondary: "#B2B2B2",
  },
};

const Text: ComponentStyleConfig = {
  variants: {
    "with-title": {
      fontSize: "16px",
      lineHeight: "28px",
      color: "color.white",
    },
    notoSan: {
      fontSize: "48px",
      lineHeight: "25px",
      color: "color.white",
    },
    dmSan: {
      fontSize: "16px",
      fontWeight: "700",
      lineHeight: "32px",
      color: "color.white",
    },
  },
};

const Button: ComponentStyleConfig = {
  variants: {
    primary: {
      bg: "#fedf56",
      borderRadius: "8px",
      color: "#6a5809",
      fontWeight: "bold",
      padding: "25px 30px",
      border: "1px solid #fedf56",
      fontSize: "15px",
    },
    disable: {
      bg: "#352c04",
      borderRadius: "8px",
      color: "#6a5809",
      fontWeight: "bold",
      padding: "25px 30px",
      border: "1px solid #6f632a",
      fontSize: "15px",
    },
    outline: {
      borderRadius: "5px",
      color: "#fedf56",
      fontWeight: "bold",
      padding: "12px 36px",
      border: "1px solid rgba(254,223,86,.6) !important",
    },
    solid: (props: GlobalStyleProps) => ({
      bg: props.colorMode === "dark" ? "red.300" : "red.500",
    }),
  },
};

const Input: ComponentStyleConfig = {
  variants: {
    primary: {
      bgColor: "#0E1E45",
      color: "color.white",
      padding: "16px 32px",
      fontSize: "18px",
    },
  },
};

const components = {
  Button,
  Text,
  Input,
};

export const theme = extendTheme({
  config,
  colors,
  components,
});
