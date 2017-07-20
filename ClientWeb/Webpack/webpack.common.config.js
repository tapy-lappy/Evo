/// <reference path="typings/global.d.ts" />
/// <reference path="typings/webpack.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('webpack'), 
//ContextReplacementPlugin,
DefinePlugin = _a.DefinePlugin, CommonsChunkPlugin = _a.optimize.CommonsChunkPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
//const { ConcatSource } = require('webpack-sources');
//const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
//const AssetsPlugin = require('assets-webpack-plugin');
var helper = require("./helpers/path.helper");
var publicPath = 'wwwroot/dist/web';
var Common = (function () {
    function Common(options) {
        if (options === void 0) { options = {}; }
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
    Common.prototype.webpackConfig = function () {
        var DLL = require(helper.root('src/dll'));
        var polyfills = DLL.polyfills(this.Metadata);
        var vendors = DLL.vendors();
        var rxjs = DLL.rxjs();
        var bootstrap = DLL.bootstrap();
        //console.log("All vendors: ", JSON.stringify([].concat(vendors, rxjs), null, 2));
        var extractCSS = new ExtractTextPlugin('css/[name].css');
        var extractLESS = new ExtractTextPlugin({ filename: 'css/[name].LESS.css', ignoreOrder: true });
        var extractPDB = new ExtractTextPlugin({ filename: 'pdbAssets/[name].pdb' });
        return {
            target: 'web',
            entry: {
                polyfills: polyfills,
                vendors: [].concat(vendors, rxjs),
                bootstrap: bootstrap,
                //main: './Angular2/main'
                main: './Evolution/main'
            },
            //https://webpack.js.org/configuration/output
            output: {
                path: helper.root(publicPath),
                //publicPath: helper.concat('/', publicPath, '/'),           //TODO: dev/pro configuration for 'web'
                //Remark: I suppose for production also '/' should be used:
                publicPath: this.Metadata.IS_PRODUCTION ? helper.concat(publicPath, '/') : '/',
                filename: '[name].bundle.js',
                sourceMapFilename: '[name].bundle.map',
                chunkFilename: 'chunk-[name]-[id].js',
                //USEFUL - HMR(Image how it works) with CSS replacement - https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07#.coqd1yp0s
                hotUpdateMainFilename: "hot/[hash].hot-update.json",
                hotUpdateChunkFilename: "hot/[hash].[id].hot-update.js" //by default - HMR chunk
                //libraryTarget: 'commonjs'                                 //https://www.youtube.com/playlist?list=PLDyvV36pndZHfBThhg4Z0822EEG9VGenn
            },
            module: {
                exprContextCritical: false,
                rules: [
                    //TODO: do we need it? We have one loader inside webpack.dev.config.ts for TS
                    //Done: Yes!!! It loads and compiles Angular Components! Angular code won't work without it.
                    {
                        test: /\.ts$/,
                        use: ['angular2-template-loader'],
                        exclude: [
                            helper.root("node_modules"),
                        ]
                    },
                    {
                        test: /\.html$/,
                        loader: 'html-loader'
                    },
                    {
                        //regex doesn't match any files of the pattern *config.js(ts) but matches rest of *.js(ts)     https://github.com/bline/bootstrap-webpack/issues/9#issuecomment-77898728
                        test: /^((?!config).)*\.(js|ts)?$/,
                        //test: /\.(js|ts)$/,
                        use: ["source-map-loader"],
                        exclude: [
                            // FIX for Angular 4 --- workaround for this issue:
                            // http://stackoverflow.com/a/43446971
                            // https://github.com/angular-redux/store/issues/64#issuecomment-223489640
                            helper.root('node_modules/@angular/compiler'),
                            //helper.root('node_modules/bootstrap-webpack'),            //to prevent conflict and allow bootstrap-webpack load Bootstrap JS files
                            //helper.root('Webpack/bootstrap-webpack/bootstrap.config.js')    //works, but it's redundant - see Regex
                            helper.root('Libraries') //exclude 3d party libs
                        ],
                        enforce: "pre" //https://webpack.js.org/configuration/module/#rule-enforce
                    },
                    //USEFUL - HMR(Image how it works) with CSS replacement - https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07#.coqd1yp0s
                    {
                        test: /\.css$/,
                        //this will combine ALL *.css files into SEPARATE [name].css
                        //loader: "style-loader!css-loader"
                        //this will combine ALL *.css files into ONE main.css
                        //use: ExtractTextPlugin.extract({fallback: 'style-loader', use: [
                        //this will combine ALL *.less files into SEPARATE [name].css
                        // use: new ExtractTextPlugin('[name].css').extract({fallback: 'style-loader', use: [
                        //     {loader: 'css-loader', options: {sourceMap: true}}]})
                        //this will combine ALL *.css files into SEPARATE [name].css
                        use: extractCSS.extract({ fallback: 'style-loader', use: [
                                //'style-loader',   //it cause error: http://stackoverflow.com/a/35369247
                                { loader: 'css-loader', options: { sourceMap: true /*, importLoaders: 1*/ } },
                            ] })
                    },
                    {
                        test: /\.less$/i,
                        //this will combine ALL *.less files into SEPARATE [name].css
                        // use: [{
                        //     loader: "style-loader" // creates style nodes from JS strings
                        // }, {
                        //     loader: "css-loader", // translates CSS into CommonJS
                        //     options: {
                        //         sourceMap: true
                        //     }
                        // }, {
                        //     loader: "less-loader", // compiles Less to CSS
                        //     options: {
                        //         sourceMap: true
                        //     }
                        // }]
                        //this will combine ALL *.less files into ONE main.css
                        //use: ExtractTextPlugin.extract({fallback: 'style-loader', use: [
                        //this will combine ALL *.less files into SEPARATE [name].css
                        // use: new ExtractTextPlugin("[name].css").extract({fallback: 'style-loader', use: [
                        //     {loader: 'css-loader', options: {sourceMap: true}},
                        //     {loader: 'less-loader', options: {sourceMap: true}}]
                        // })
                        //this will combine ALL *.less files into SEPARATE [name].css
                        use: extractLESS.extract({ fallback: 'style-loader', use: [
                                //'style-loader',       //it cause error: http://stackoverflow.com/a/35369247
                                { loader: 'css-loader', options: { sourceMap: true } },
                                { loader: 'less-loader', options: { sourceMap: true } }
                            ] })
                    },
                    {
                        test: /\.json$/,
                        loader: 'json-loader',
                    },
                    {
                        test: /\.(png|jpe?g|gif|ico)$/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    //outputPath: 'images/',
                                    name: 'images/[ext]/[path][name].[ext]',
                                    context: './wwwroot/images'
                                }
                            }
                        ]
                    },
                    //TODO: using expose-loader/export-loader/ProvidePlugin for jQuery here instead of within TS file
                    {
                        //Remark: Allows using window.$/window.jQuery in web browser BUT doesn't expose it in component
                        //files. Need to expose internaly there: let $ = require("expose-loader?$!jquery");
                        test: require.resolve('jquery'),
                        use: [{
                                loader: 'expose-loader',
                                options: 'jQuery'
                            }, {
                                loader: 'expose-loader',
                                options: '$'
                            }]
                    },
                    //To point WebPack how to process MOL/PDB/XYZ/SDF files
                    {
                        test: /\.(pdb|xyz|mol|sdf)$/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[ext]/[path][name].[ext]',
                                    context: './Evolution/Molecules'
                                }
                            }
                        ],
                    },
                    // {
                    //     test: /\.txt$/,
                    //     use: [
                    //         {
                    //             loader: 'raw-loader'
                    //         }],
                    // },   //https://github.com/webpack-contrib/raw-loader   https://www.npmjs.com/package/raw-loader
                    //https://www.npmjs.com/package/bootstrap-webpack
                    //https://github.com/bline/bootstrap-webpack
                    // **IMPORTANT** This is needed so that each bootstrap js file required by
                    // bootstrap-webpack has access to the jQuery object - https://github.com/shakacode/bootstrap-sass-loader#example-loaders-configuration
                    //{ test: /bootstrap\/js\//, loader: 'imports-loader?jQuery=jquery' },        //WORKS WITHOUT THIS: load jQuery to allow Bootstrap scripts to execute
                    // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
                    // loads bootstrap's css.
                    { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                        use: [{ loader: 'url-loader', options: {
                                    name: 'images/[path][name].[ext]',
                                    context: './node_modules',
                                    limit: '10000',
                                    mimetype: 'application/font-woff'
                                } }] },
                    { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                        use: [{ loader: 'url-loader', options: {
                                    name: 'images/[path][name].[ext]',
                                    context: './node_modules',
                                    limit: '10000',
                                    mimetype: 'application/font-woff2'
                                } }] },
                    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                        use: [{ loader: 'url-loader', options: {
                                    name: 'images/[path][name].[ext]',
                                    context: './node_modules',
                                    limit: '10000',
                                    mimetype: 'application/octet-stream'
                                } }] },
                    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                        use: [{ loader: 'file-loader', options: {
                                    name: 'images/[path][name].[ext]',
                                    context: './node_modules'
                                } }] },
                    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                        use: [{ loader: 'url-loader', options: {
                                    name: 'images/[path][name].[ext]',
                                    context: './node_modules',
                                    limit: '10000',
                                    mimetype: 'image/svg+xml'
                                } }] }
                ]
            },
            plugins: [
                new CommonsChunkPlugin({
                    name: ['common', 'polyfills'] //http://stackoverflow.com/a/39600793 - combine all repeatable things(from all chunks: polyfills, vendors, main etc.) in common and make polyfills as entry chunk
                    //name: 'common',
                    //filename: '[name].bundle.js'
                    //name: ['main', 'polyfills', 'vendors']        //in this CommonsChunkPlugin exist problem with names order!!! I found smt. in CommonsChunkPlugin documentation about importance of this order!
                }),
                //https://www.npmjs.com/package/html-webpack-plugin
                new HtmlWebpackPlugin({
                    title: 'Evo',
                    filename: 'index.html',
                    //Load a custom template (ejs by default see the FAQ for details):
                    template: './indexWebpackTemplate.ejs',
                    inject: 'body',
                    favicon: helper.root('wwwroot/images/dna.jpg'),
                    chunks: ['polyfills', 'common', 'vendors', 'bootstrap', 'main'],
                    chunksSortMode: 'dependency',
                    excludeChunks: [] //skip some chunks
                }),
                //https://webpack.js.org/plugins/extract-text-webpack-plugin/#usage
                /*It moves all the required *.css modules in entry chunks into a separate CSS file. So your styles are no longer inlined into
                the JS bundle, but in a separate CSS file (styles.css). If your total stylesheet volume is big, it will be faster because the
                CSS bundle is loaded in parallel to the JS bundle.*/
                /*BUT!!! It only works if you use it ONLY with loader:
                * test: /\.css$/,
                * use: {loader: "style-loader!css-loader"}
                * It won't work(won't extract CSS files to separate CSS file and they will be inlined in
                * the JS bundle) if you will use another ExtractTextPlugin instead of using loader:
                * use: ExtractTextPlugin.extract(
                * OR
                * use:  extractLESS.extract(*/
                //new ExtractTextPlugin('css/[name].css'), //extracts CSS(which HtmlWebpackPlugin bury into scripts) into external .css files
                extractCSS,
                extractLESS,
                extractPDB,
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
                // new AssetsPlugin({       //https://github.com/kossnocorp/assets-webpack-plugin
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
                    ENV: this.Metadata.ENV,
                    IS_PRODUCTION: this.Metadata.IS_PRODUCTION,
                    HMR: this.Metadata.HMR,
                    PORT: this.Metadata.PORT,
                    HOST: this.Metadata.HOST,
                    HTTPS: this.Metadata.HTTPS,
                    METADATA: this.Metadata,
                    'process.env': this.Metadata //https://github.com/AngularClass/angular2-webpack-starter/wiki/How-to-pass-environment-variables%3F
                }),
            ],
            resolve: {
                //Note: extensions that are used:
                extensions: ['.ts', '.js', '.css', '.json'],
                // unsafeCache: true,
                //modules: [ root('node_modules') ]
                modules: ["node_modules",] //Note: directories where to look for modules - "Libraries" contains only 3d party libs and doesn't contain modules
            },
        };
    };
    return Common;
}());
exports.default = Common;
