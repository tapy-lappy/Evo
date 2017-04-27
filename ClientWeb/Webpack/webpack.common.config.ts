/// <reference path="typings/global.d.ts" />
/// <reference path="typings/webpack.d.ts" />

const {
    //ContextReplacementPlugin,
    DefinePlugin,
    //ProgressPlugin,
    //DllReferencePlugin,
//    LoaderOptionsPlugin,      //commented for now
    optimize: {
        CommonsChunkPlugin
    }
} = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const { ConcatSource } = require('webpack-sources');
//const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
//const AssetsPlugin = require('assets-webpack-plugin');
import helper = require('./helpers/path.helper');
const publicPath: string = 'wwwroot/dist/web';


export default class Common{
    readonly Metadata: IMetadata;
    readonly Configuration: IWebpackConfig;     //type definition for WebpackConfig is defined in webpack.d.ts

    constructor(options: EnvOptions = {})
    {
        this.Metadata = {
            ENV: JSON.stringify(options.ENV),
            IS_PRODUCTION: options.ENV != null && options.ENV.indexOf('prod') !== -1,
            HMR: options.HMR || false,
            PORT: options.PORT || 9001,
            HOST: JSON.stringify(options.HOST) || JSON.stringify('localhost'),
            HTTPS: options.HTTPS || false
        };

        //console.log('METADATA', JSON.stringify(this.Metadata, null, 2));
        this.Configuration = this.webpackConfig();
    }


    webpackConfig(): IWebpackConfig {
        const DLL = require(helper.root('src/dll'));
        const polyfills = DLL.polyfills(this.Metadata);
        const vendors = DLL.vendors();
        const rxjs = DLL.rxjs();

        //console.log("All vendors: ", JSON.stringify([].concat(vendors, rxjs), null, 2));

        return {
            target: 'web',

            entry: {
                polyfills: polyfills,
                vendors: [].concat(vendors, rxjs),
                //main: './Angular2/main'
                main: './Evolution/main'
            },

            //https://webpack.js.org/configuration/output
            output: {
                path: helper.root(publicPath),             //The output directory as an absolute path  //TODO: dev/pro configuration for 'web'
                publicPath: helper.concat('/', publicPath, '/'),           //TODO: dev/pro configuration for 'web'
                filename: '[name].bundle.js',
                sourceMapFilename: '[name].bundle.map',
                chunkFilename: '[id].[name].chunk.js',
                //USEFUL - HMR(Image how it works) with CSS replacement - https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07#.coqd1yp0s
                hotUpdateMainFilename: "hot/[hash].hot-update.json",        //by default - HMR manifest
                hotUpdateChunkFilename: "hot/[hash].[id].hot-update.js"     //by default - HMR chunk
                //libraryTarget: 'commonjs'                                 //https://www.youtube.com/playlist?list=PLDyvV36pndZHfBThhg4Z0822EEG9VGenn
            },

            module: {
                exprContextCritical: false, //workaround: https://github.com/AngularClass/angular2-webpack-starter/issues/993
                rules: [
                    {
                        test: /\.ts$/,
                        use: [
                            'angular2-template-loader'],
                        exclude: [
                            helper.root("node_modules"),
                            //  /\.(spec|e2e|d)\.ts$/                 //doesn't work - if you don't want files with extensions '.spec.ts, .e2e.ts, .d.ts' will be loaded by webpack - just exclude them from loader and manually add typings by using /// <reference path="../path_to/custom-typings.d.ts" /> in files(TS) where you need that typings
                        ]
                    },
                    {
                        test: /\.html$/,
                        loader: 'html-loader'
                    },
                    {
                        test: /\.(js|ts)$/,
                        use: ["source-map-loader"],
                        exclude: [
                            // FIX for Angular 4 --- workaround for this issue:
                            // http://stackoverflow.com/a/43446971
                            // https://github.com/angular-redux/store/issues/64#issuecomment-223489640
                            helper.root('node_modules/@angular/compiler'),           //exclude files from loader(they won't be loaded by webpack)
                            helper.root('node_modules/bootstrap-webpack')            //to prevent conflict and allow bootstrap-webpack load Bootstrap JS files
                        ],
                        enforce: "pre"
                    },
                    //USEFUL - HMR(Image how it works) with CSS replacement - https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07#.coqd1yp0s
                    {
                        test: /\.css$/,
                        loader: "style-loader!css-loader"
                    },
                    {
                        test: /\.less$/,    //https://github.com/webpack-contrib/less-loader
                        use: [{
                            loader: "style-loader" // creates style nodes from JS strings
                        }, {
                            loader: "css-loader", // translates CSS into CommonJS
                            options: {
                                sourceMap: true
                            }
                        }, {
                            loader: "less-loader", // compiles Less to CSS
                            options: {
                                sourceMap: true
                            }
                        }]
                    },
                    {
                        test: /\.json$/,
                        loader: 'json-loader',
                        //include: [root('./src')]              //TODO: what does it mean?
                    },
                    // {
                    //     test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                    //     loader: 'file-loader?name=assets/[name].[hash].[ext]'
                    // },

                    //https://www.npmjs.com/package/bootstrap-webpack
                    //https://github.com/bline/bootstrap-webpack
                    // **IMPORTANT** This is needed so that each bootstrap js file required by
                    // bootstrap-webpack has access to the jQuery object
                    { test: /bootstrap\/js\//, loader: 'imports-loader?jQuery=jquery' },
                    // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
                    // loads bootstrap's css.
                    { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff" },
                    { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff2" },
                    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
                    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file-loader" },
                    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
                ]
            },


            plugins: [
                new CommonsChunkPlugin({
                    name: ['common', 'polyfills']   //http://stackoverflow.com/a/39600793 - combine all repeatable things(from all chunks: polyfills, vendors, main etc.) in common and make polyfills as entry chunk
                    //name: 'common',
                    //filename: '[name].bundle.js'

                    //name: ['main', 'polyfills', 'vendors']        //in this CommonsChunkPlugin exist problem with names order!!! I found smt. in CommonsChunkPlugin documentation about importance of this order!
                }),
                //https://www.npmjs.com/package/html-webpack-plugin
                new HtmlWebpackPlugin({ //To generate more than one HTML file, declare the plugin more than once
                    filename: 'index.html',
                    template: './indexWebpackTemplate.html',
                    inject: 'body',
                    favicon: helper.root('wwwroot/images/warning.png'),
                    chunks: ['polyfills', 'common', 'vendors', 'main'],  //Add only specific chunks onto page
                    chunksSortMode: 'dependency',                            //how chunks should be sorted before they are included to the html -  http://stackoverflow.com/a/39119631
                    excludeChunks: []                                        //skip some chunks
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
                //-----------------------------------------------
                // new AssetsPlugin({
                //     path: root('dist'),
                //     filename: 'webpack-assets.json',
                //     prettyPrint: true
                // }),
                // new DllReferencePlugin({
                //     context: '.',
                //     manifest: getManifest('vendors'),
                // }),
                // new DllReferencePlugin({
                //     context: '.',
                //     manifest: getManifest('polyfills'),
                // }),

                //new TsConfigPathsPlugin( { configFilePath: helper.root('31_tsconfig.json')/*, compiler*/ } ),      //https://www.npmjs.com/package/shmawesome-typescript-loader
                new DefinePlugin({
                    ENV: this.Metadata.ENV,                          //global.d.ts - initialize defined global variables
                    IS_PRODUCTION: this.Metadata.IS_PRODUCTION,
                    HMR: this.Metadata.HMR,
                    PORT: this.Metadata.PORT,
                    HOST: this.Metadata.HOST,
                    HTTPS: this.Metadata.HTTPS,

                    METADATA: this.Metadata,                         //global.d.ts - initialize defined global METADATA variable

                    'process.env': this.Metadata             //https://github.com/AngularClass/angular2-webpack-starter/wiki/How-to-pass-environment-variables%3F
                }),         //allows you to create global constants which can be configured at compile time - https://webpack.js.org/plugins/define-plugin/
                //new ProgressPlugin({}),
                //-----------------------------------------------
                // new LoaderOptionsPlugin({
                //     options: {
                //         metadata: this.Metadata,     //http://stackoverflow.com/a/39602569 - have to add custom properties via LoaderOptionsPlugin
                //         // postcss: [
                //         //     require('autoprefixer'),
                //         //     // require ('postcss-cssnext'), // or use this instead
                //         // ],
                //     }
                // })

            ],

            resolve: {
                extensions: ['.ts', '.js', '.css', '.json'],     //resolve extension-less imports - it's important to save order .ts before .js because you lost possibility to debug in browser(ts files won't be loaded) - https://github.com/schempy/angular2-typescript-webpack/issues/4#issuecomment-215756985
                // unsafeCache: true,
                //modules: [ root('node_modules') ]
            },
        };
    }
}
