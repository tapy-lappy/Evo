"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
let __root = resolve('../..');
function root(__path = '.') {
    return path.join(__root, __path);
}
exports.root = root;
//TODO: why declared 'path.join(...string[])' but IntelliSence shows as'path.join(...string)' end error when trying to send there ...string[] ?
//TODO: join() must be the same function as root() is. But it has argument of string[] as a parameter and EXCEPT in runtime!!! Clarify why!
function join(...paths) {
    // console.log('-----------------');
    // console.log(paths);
    return path.join(__root, paths);
}
exports.join = join;
function resolve(__path) {
    return path.resolve(__dirname, __path); //__dirname - current directory location
}
exports.resolve = resolve;
function concat(...paths) {
    let result = '';
    paths.forEach((path, index, array) => {
        result = result.concat(path);
    });
    return result;
}
exports.concat = concat;
function webpackConfig(configName) {
    return root('Webpack/'.concat(configName));
}
exports.webpackConfig = webpackConfig;
//# sourceMappingURL=path.helper.js.map