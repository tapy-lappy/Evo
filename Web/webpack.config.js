// /// <binding ProjectOpened='Watch - Development' />      need to add flag --watch to webpack start script: webpack --watch

//switch (process.env.NODE_ENV) {
//    case 'prod':
//    case 'production':
//        //module.exports = require('./webpack_config/webpack.prod')({ env: 'production' });     //hasn't ready yet
//        break;
//    case 'dev':
//    case 'development':
//    default:
//        module.exports = require('./webpack_config/webpack.dev')({ env: 'development' });
//}


var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var WebpackNotifierPlugin = require('webpack-notifier');
var nodeExternals = require('webpack-node-externals');
var allFilenamesExceptJavaScript = /\.(?!js(\?|$))([^.]+(\?|$))/;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers/helpers');

var baseConfig = {
    //target: 'node',
    resolve: { extensions: ['.js', '.ts'] }, //resolve extension-less imports
    entry: {
        polyfills: './wwwroot/Angular2/src/polyfills',
        vendor: './wwwroot/Angular2/src/vendor.ts',
        page1: './wwwroot/Angular2/main.ts'
    },
    output: {
        //filename: '[name].bundle.js',
        path: path.resolve(__dirname, './wwwroot/dist'),
        publicPath: '/bundle/',
        //libraryTarget: 'commonjs'
    },
    devtool: "cheap-eval-source-map", //https://webpack.js.org/configuration/devtool/     https://webpack.js.org/guides/development/
    devServer: {
        contentBase: path.join(__dirname, "wwwroot/dist"), //what directory web-dev-server should start watching(BUNDLE) to recompile when BUNDLE changed
        publicPath: "/bundle/", //to let webpack-dev-server to know what URL should be used to display BUNDLE file: http://localhost:9001/bundle/web/page1.bundle.js - /web/ because we add folder for that
        host: "localhost",
        port: 9001
    },
    //externals: [nodeExternals({ whitelist: [allFilenamesExceptJavaScript] })], // Don't bundle .js files from node_modules
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['page1', 'vendor', 'polyfills', 'common'] //goes through hierarchy and put INITIAL CHUNK to the last file definition in array(my case - 'common'). This INITIAL CHUNK script file MUST APPEAR on the page as FIRST <script> refference. Otherwise, you got ReferenceError: webpackJsonp is not defined
                //filename: 'chunk1'
        }),
        //put scripts onto page in reverse order that they are described in webpack.optimize.CommonsChunkPlugin
        new HtmlWebpackPlugin({ //https://www.npmjs.com/package/html-webpack-plugin
            filename: 'WebpackTest.html',
            template: 'wwwroot/webpack.html',
            //chunksSortMode: 'dependency'
        }),
        new ExtractTextPlugin('[name].css'), //extracts CSS(which HtmlWebpackPlugin bury into scripts) into external .css files

        //new webpack.optimize.AggressiveSplittingPlugin({
        //    minSize: 5000,
        //    maxSize: 10000
        //}),

        ////workaround: https://github.com/angular/angular/issues/11580 - it works, but I found another one - see module{} section
        //new webpack.ContextReplacementPlugin(     
        //  /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        //  path.resolve(__dirname, 'doesnotexist/')
        //),
        new WebpackNotifierPlugin({ //to notify about webpack has finished bundling
            //excludeWarnings: true,
            title: "Webpack Notifier Plugin message",
            contentImage: path.join(__dirname, 'wwwroot/images/warning.png'),
            //alwaysNotify: true,             //cause double notification
            //skipFirstNotification: true
        })
    ],
    module: {
        exprContextCritical: false, //workaround: https://github.com/AngularClass/angular2-webpack-starter/issues/993
        rules: [{
                    test: /\.ts$/,
                    loaders: [{
                        loader: 'awesome-typescript-loader',
                        options: { configFileName: helpers.root('wwwroot/Angular2', 'tsconfig.json') }
                    }, 'angular2-template-loader']
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                // {
                //     test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                //     loader: 'file-loader?name=assets/[name].[hash].[ext]'
                // },
                // {
                //     test: /\.css$/,
                //     exclude: helpers.root('src', 'app'),
                //     loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
                // },
                // {
                //     test: /\.css$/,
                //     include: helpers.root('src', 'app'),
                //     loader: 'raw-loader'
                // }
            ] //,
            //loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
    }
};

let targets = ['web' /*'webworker', 'node'*/ /*, 'async-node', 'node-webkit', 'electron-main'*/ ].map((target) => {
    let base = webpackMerge(baseConfig, {
        target: target,
        output: {
            path: path.resolve(__dirname, './wwwroot/dist/' + target),
            filename: '[name].bundle.js',
            chunkFilename: '[id].[name].chunk.js'
        }
    });
    return base;
});

module.exports = targets;