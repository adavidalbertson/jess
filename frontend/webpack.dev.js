const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: "./public",
        port: 4041,
        open: false,
        historyApiFallback: true
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
                    'style-loader',
                    'css-loader', 
                    'less-loader'
                ],
            },
        ]
}
});
