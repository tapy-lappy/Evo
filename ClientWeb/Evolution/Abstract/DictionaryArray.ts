//https://stackoverflow.com/a/35370453
interface IDictionary<T>{
    [key: string]: T;
}
// interface IKeyValuePair<T>{
//     keyValuePairs: {key: T}[];
// }
interface IArray<T>{            //TODO: it's possible to use standartized Array<T> instead of IArray<T>
    [index: number]: T;
}

interface IDictionaryArray<T>{
    dictionary: IDictionary<T>;
    array: IArray<T>;
    length: number;
    //new (source: IDictionary<T> | IArray<T>): IDictionaryArray<T>;      //constructon annotation in interface
}

export default class DictionaryArray<T> implements IDictionaryArray<T>{
    //private source: { [index:string]: T; } | { [index:number]: T; };      //it's possible to use this object notation
    private source: IDictionary<T> | IArray<T>;
    //readonly _dictionary: IDictionary<T> = {} as IDictionary<T>;
    get dictionary(){return this.toDictionary();}
    //pairs: IKeyValuePair<T> = {keyValuePairs: []};
    //readonly _array: IArray<T> = {};
    get array(): IArray<T>{return this.toArray();}
    //[key: string]: (key:string)=>T;           //string literal object(type)/associative array/string indexed object(interface)/dictionary which values are functions

    constructor(source: IDictionary<T> | IArray<T>){
        this.source = source;
    }

    get length(): number{
        return this.array ? Object.keys(this.array).length : 0;
    }

    get checkSource(){return this.source != undefined && this.source != null;}
    toArray(): T[]{
        if(!this.checkSource) return [];
        let array:any = this.source;    //Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
        return Object.keys(array).map(prop => array[prop]);
    }
    // toKeyValuePairs(): { key: T; }[] {
    //     if(!this.checkSource) return [];
    //     let dictionary:any = this.source;//Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
    //     return Object.keys(dictionary).map(key => {return {key: dictionary[key]};});
    // }
    toDictionary(): {[key: string]: T} {      //transformation to indexed object
        if(!this.checkSource) return {};
        let dictionary:any = {};//Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
        let collection:any = this.source;//Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
        Object.keys(this.source).map(key => dictionary[key]=collection[key]);
        return dictionary as {[key: string]: T};
    }

    cast<U extends IDictionary<T> | IArray<T>>(): U{
        return <U>this.source;
    }
    contains(keyIndexValue: string|number|T){
        if(typeof keyIndexValue === "string")
            return this.cast<IDictionary<T>>()[keyIndexValue] != undefined;
        else if (typeof keyIndexValue === "number")
            return this.cast<IArray<T>>()[keyIndexValue] != undefined;
        else
            return this.cast<Array<T>>().some(item => item === keyIndexValue);
    }
    add(value: T, keyIndex?: number|string){
        if(typeof keyIndex === "string") {
            if(this.contains(keyIndex))
                throw Error(`Item with key: ${keyIndex} is already there`);
            this.cast<IDictionary<T>>()[keyIndex] = value;
        }
        else {
            if(!keyIndex && this.contains(value))                                   //keyIndex is not provided
                throw Error(`Item: ${value} is already there`);
            else if(this.contains(keyIndex))                                        //typeof keyIndex === 'number'
                throw Error(`Item with an index[${keyIndex}] is already there`);
            this.cast<Array<T>>().push(value);                                      //if all fine
        }
    }
    remove(index:number):void;
    remove(key:string):void;
    remove(keyIndex: number|string){
        if(!this.contains(keyIndex))
            throw Error(`Item with index/key: ${keyIndex} is absent`);
        if(typeof keyIndex === "number")
            delete this.cast<IArray<T>>()[keyIndex];
        else if (typeof keyIndex === "string")
            delete this.cast<IDictionary<T>>()[keyIndex];
    }
}