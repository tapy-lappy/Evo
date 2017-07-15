"use strict";
/// <reference path="typings/global.d.ts" />
/// <reference path="typings/webpack.d.ts" />
exports.__esModule = true;
var webpack_common_config_1 = require("./webpack.common.config");
var _a = require('webpack'), HotModuleReplacementPlugin = _a.HotModuleReplacementPlugin, NamedModulesPlugin = _a.NamedModulesPlugin, ProvidePlugin = _a.ProvidePlugin;
var WebpackNotifierPlugin = require('webpack-notifier');
var webpackMerge = require('webpack-merge');
var helper = require("./helpers/path.helper");
//let Common = require(helper.webpackConfig('webpack.common.config'));
module.exports = function webpackDevConfig(options) {
    if (options === void 0) { options = {}; }
    var common = new webpack_common_config_1["default"](options);
    return webpackMerge(common.Configuration, {
        //cache: true,                                  //TODO: need or not?
        //devtool: "cheap-eval-source-map", //For HMR - https://github.com/webpack/webpack/issues/2478#issuecomment-220205767  //https://webpack.js.org/configuration/devtool/     https://webpack.js.org/guides/development/
        //https://webpack.js.org/configuration/devtool/#devtool
        devtool: 'cheap-module-eval-source-map',
        //cheap-eval-source-map                           - transformed code (lines only) ---  transpiled JS files
        //eval-source-map, cheap-module-eval-source-map   - original source --- TS files
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [].concat(common.Metadata.HMR ? { loader: '@angularclass/hmr-loader' } : []) //to turn on HMR for TS/HTML templates when using Angular2
                        .concat([
                        {
                            loader: 'awesome-typescript-loader'
                        }
                    ]),
                    exclude: [
                        helper.root("node_modules"),
                    ]
                }
            ]
        },
        plugins: [
            new NamedModulesPlugin(),
            new WebpackNotifierPlugin({
                //excludeWarnings: true,
                title: "Webpack Notifier Plugin message",
                contentImage: helper.root('wwwroot/images/warning.png'),
                message: "Wow, Build Successful!",
                alwaysNotify: true
            }),
        ].concat(common.Metadata.HMR ? new HotModuleReplacementPlugin() : []),
        //https://webpack.js.org/configuration/dev-server
        devServer: {
            //contentBase: path.join(__dirname, "wwwroot/dist"), //for static files - what directory(ies) web-dev-server will looking at file changes and if that changes happens it will recompile whole BUNDLE
            publicPath: common.Configuration.output.publicPath,
            host: JSON.parse(common.Metadata.HOST),
            port: common.Metadata.PORT,
            staticOptions: {},
            stats: {
                colors: true //`webpack --colors` equivalent - https://webpack.js.org/configuration/stats/
            },
            compress: false,
            historyApiFallback: true,
            https: common.Metadata.HTTPS,
            //public:'0.0.0.0:9001',
            inline: common.Metadata.HMR,
            hot: common.Metadata.HMR //enable HMR on the server - 'hot: true'  doesn't allow PAGE to reload automatically when changes was done in *.ts files. Instead of this it load only pieces of changed *.ts files to browser
            //quiet: false
        }
    });
};
