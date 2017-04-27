/// <reference path="./Webpack/typings/global.d.ts" />
/// <reference path="./Webpack/typings/webpack.d.ts" />

//import {root} from "./Webpack/helpers/path.helper";
import helper = require('./Webpack/helpers/path.helper');

// type definition for WebpackConfig is defined in webpack.d.ts
function webpackConfig(options: EnvOptions = {}): IWebpackConfig {
    switch (options.ENV){
        case 'dev':
        case 'development':
        default:
            //return require(root('Webpack/webpack.dev.config'))({options: options});
            return require(helper.webpackConfig('webpack.dev.config'))(options);
        case 'prod':
        case 'production':
            //return require(root('Webpack/webpack.prod.config'))({options});
            return require(helper.webpackConfig('webpack.prod.config'))(options);
        case 'test':
            return require(helper.webpackConfig('webpack.test.config'))(options);
    }
}

// Export
module.exports = webpackConfig;     //http://ru.stackoverflow.com/a/452678 - returning 'function'
