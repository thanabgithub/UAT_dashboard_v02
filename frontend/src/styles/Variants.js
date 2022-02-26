const theme = "dark";
//const theme = 'light';
export const lightTheme = theme === "light";

// https://icolorpalette.com/download/palette/510060_color_palette.jpg

export const color = lightTheme ? "white" : "#415671";
export const color2 = lightTheme ? "white" : "#010e2c";
export const color3 = lightTheme ? "#09f010" : "#42ff3a";

if (lightTheme) {
  document.body.style.background = "#e1eaee";
  document.body.style.color = "#061a44";
}

export const lightGreyBackground = `background-color: ${color}`;
export const backgroundColor2 = `background-color: ${color2};`;
export const greenBackgroundColor = `background-color: ${color3};`;

export const fontColorGreen = `color: #03A9F4`;
export const fontColorWhite = `color: white`;
export const subtleBoxShadow = `box-shadow: 0px 0px 5px 1px ${
  lightTheme ? "#a9b6ff" : "#121d5b"
}`;
export const palevioletredBoxShadow = `box-shadow: 0px 0px 2px 2px palevioletred`;
export const brightGlowBoxShadow = `box-shadow: 0px 0px 3px 1px #b4c2d4`;
export const redBoxShadow = `box-shadow: 0px 0px 3px 1px #cd2c69`;

export const fontSizeBig = "font-size: 2em";
export const fontSize1 = "font-size: 1.25em;";
export const fontSize2 = "font-size: 0.75em";
export const fontSize3 = "font-size: .50em";

export const fontFamilyReading = "font-family: Roboto";

export const textAlignCenter = "text-align: center;";
