const merge = require("webpack-merge");
// const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        // new UglifyJSPlugin()
        new MiniCssExtractPlugin({
            filename: `styles/[name].css`
          }),
    ],
    module: {
        rules: [
            { 
                test: /\.less$/,
                use: [ 
                    MiniCssExtractPlugin.loader, 
                    'css-loader', 
                    'less-loader'
                ],
            },
        ]
}
});
