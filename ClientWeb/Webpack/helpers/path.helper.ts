const path = require('path');
let __root = resolve('../..');

export function root(__path = '.'): string {
    return path.join(__root, __path);
}

//TODO: why declared 'path.join(...string[])' but IntelliSence shows as'path.join(...string)' end error when trying to send there ...string[] ?
//TODO: join() must be the same function as root() is. But it has argument of string[] as a parameter and EXCEPT in runtime!!! Clarify why!
export function join(...paths: string[]): string{
    // console.log('-----------------');
    // console.log(paths);
    return path.join(__root, paths);
}

export function resolve(__path: string){
    return path.resolve(__dirname, __path);     //__dirname - current directory location
}

export function concat(...paths: string[]): string{
    let result: string = '';
    paths.forEach((path, index, array) =>   //TODO: why declared 'path.join(...string[])' but IntelliSence shows as'path.join(...string)' end error when trying to send there ...string[] ?
    {
        result = result.concat(path);
    });
    return result;
}

export function webpackConfig(configName: string): string
{
    return root('Webpack/'.concat(configName));
}
