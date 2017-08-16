//----------------DictionaryArray interfaces----------------
import {InjectionToken} from "@angular/core";

export interface IArray<T>{
    [key: number]: T;
}

export interface IDictionary<T>{
    [key: string]: T;                         //Remark: doesn't needed if we extends from IndexedType<T>
}
// interface IDictionaryFunctions<T>{
//     [key: string]: (exclude: boolean)=>T;           //string literal object(type)/associative array/string indexed object(interface)/dictionary which values are functions
// }
// interface IKeyValuePair<T>{
//     keyValuePairs: {key: T}[];
// }


//----------------Casting interfaces----------------
export interface Base{}

export interface Identifiable{
    id: Symbol;
}


//----------------Error interface----------------
export interface ValidationErrorMessage{
    message: string;
}
export interface ValidationControl extends IDictionary<ValidationErrorMessage>{}
export interface ValidationControlsScheme extends IDictionary<ValidationControl>{}
export interface ErrorAccumulator extends IDictionary<string>{}