const merge = require("webpack-merge");
const path = require("path");

const common = require("./webpack.common.js");

const BUILD_DIR = path.resolve(__dirname, "public");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        contentBase: BUILD_DIR,
        port: 4041,
        open: false,
        historyApiFallback: true
    },
    output: {
        path: BUILD_DIR
    },
    devtool: "eval",
    output: {
        devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]"
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    }
});
