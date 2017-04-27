// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare const ENV: string;
declare const IS_PRODUCTION: boolean;
declare const HMR: boolean;
declare const PORT: number;
declare const HOST: string;
declare const HTTPS: boolean;

declare const METADATA: IMetadata;

interface IMetadata {
    readonly ENV: string,
    readonly IS_PRODUCTION: boolean,
    readonly HMR: boolean,
    readonly PORT: number,
    readonly HOST: string,
    readonly HTTPS: boolean
}

type EnvOptions = any;  //type aliasing

// declare module RxNode {
//     export interface ...
// }

//type GreetingLike = string | (() => string) | MyGreeter;      //type aliasing
//function fn(x: (a: string, b: number, c?: number) => void) { }
