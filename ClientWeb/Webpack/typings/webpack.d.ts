// Webpack configuration types
type Entry = Array<string> | Object;        //type aliasing

type Output = {
    path: string,
    publicPath: string,
    filename: string,
    sourceMapFilename: string,
    chunkFilename: string,
    hotUpdateMainFilename: string,
    hotUpdateChunkFilename: string
};        //type aliasing

interface IWebpackConfig {
    cache?: boolean;
    target?: string;
    devtool?: string;
    entry: Entry;
    output: Output;
    module?: any;
    // module?: {
    //   preLoaders?: Array<any>;
    //   loaders?: Array<any>;
    //   postLoaders?: Array<any>
    // };
    plugins?: Array<any>;
    resolve?: {
        unsafeCache?: boolean | Array<string>;
        root?: string;
        extensions?: Array<string>;
        modules?: Array<any>;
    };
    devServer?: {
        publicPath?: string;
        staticOptions?: any;
        stats?: any;
        compress?: boolean;
        quiet?: boolean,
        contentBase?: string;
        port?: number;
        historyApiFallback?: boolean;
        hot?: boolean;
        inline?: boolean;
        host?: string;
        https?: boolean;
    };
}
