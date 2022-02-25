var WebFontLoader = require("webfontloader");
// https://www.npmjs.com/package/webfontloader
WebFontLoader.load({
  google: {
    families: ["DotGothic16", "Orbitron", "Roboto", "Zen Maru Gothic"],
  },
});
export default WebFontLoader;
