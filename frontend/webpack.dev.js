const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devServer : {
        contentBase : './public',
        port: 4041,
        open: false,
        historyApiFallback: true
    },
    devtool: 'eval',
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    }
});
