import * as fs from "fs";
import { libraryColors } from "./colours";

export const libraryColors = {
  primary: {
    light: {
      100: "#000000",
      200: "#000000",
      300: "#000000",
      400: "#000000",
      500: "#000000",
      600: "#000000",
    },
    dark: {
      100: "#000000",
      200: "#000000",
      300: "#000000",
      400: "#000000",
      500: "#000000",
      600: "#000000",
    },
  },
  secondary: {
    light: {
      100: "#000000",
      200: "#000000",
      300: "#000000",
      400: "#000000",
      500: "#000000",
      600: "#000000",
    },
    dark: {
      100: "#000000",
      200: "#000000",
      300: "#000000",
      400: "#000000",
      500: "#000000",
      600: "#000000",
    },
  },
};


const generateCssVariables = (colors) => {
  let cssVariables = ":root {\n";

  const generateVariables = (prefix, obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        generateVariables(`${prefix}-${key}`, value);
      } else {
        cssVariables += `  --${prefix}-${key}: ${value};\n`;
      }
    }
  };

  for (const [key, value] of Object.entries(colors)) {
    generateVariables(key, value);
  }

  cssVariables += "}";

  return cssVariables;
};

const cssContent = generateCssVariables(libraryColors);

// Save the CSS content to a file
fs.writeFileSync("src/utils/variables.css", cssContent);

console.log("CSS variables file generated: variables.css");
