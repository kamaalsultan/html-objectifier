// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./index_web.js", // Replace with the path to your single JavaScript file
  output: {
    filename: "bundled.js", // Specify the name of the output bundle file
    path: path.resolve(__dirname, "dist"), // Specify the output directory
    library: "html_objectifier",
    libraryTarget: "umd",
  },
  target: "web",
  externals: {
    fs: "commonjs fs",
  },
};
