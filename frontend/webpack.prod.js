const merge = require("webpack-merge");
const path = require("path");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require("./webpack.common.js");

const APP_DIR = path.resolve(__dirname, "src");
const BUILD_DIR = path.resolve(__dirname, "dist");

module.exports = merge(common, {
    mode: "production",
    output: {
        path: BUILD_DIR
    },
    plugins: [
        // new UglifyJSPlugin()
        new MiniCssExtractPlugin({
            filename: "styles/[name].css"
        }),
        new HtmlWebpackPlugin({
            template: APP_DIR + "/index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    }
});
