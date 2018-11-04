const webpack = require("webpack");
const path = require("path");

const APP_DIR = path.resolve(__dirname, "src");

module.exports = {
    entry: APP_DIR + "/index.js",
    output: {
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: "babel-loader"
            }
        ]
    }
};
