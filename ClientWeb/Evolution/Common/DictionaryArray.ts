//https://stackoverflow.com/a/35370453
export interface IDictionary<T>{
    [key: string]: T;
    //[key: string]: (key:string)=>T;           //string literal object(type)/associative array/string indexed object(interface)/dictionary which values are functions
}
// interface IKeyValuePair<T>{
//     keyValuePairs: {key: T}[];
// }

interface IDictionaryArray<T>{
    dictionary: IDictionary<T>;
    array: Array<T>;
    length: number;
    //new (source: IDictionary<T> | Array<T>): IDictionaryArray<T>;      //TODO: constructor annotation in interface
}

export type KeyValuePair = {keyIndex: number|string, value: any};
export type Predicate<T> = (item1:T)=>boolean;
export type Selector<T> = (item:T)=>string;
type KeyValuePairTransformer<T> = (item:T)=>KeyValuePair;
export type ArrayMapper<T> = {mapper: KeyValuePairTransformer<T>};
export type ArrayConverter<T> = Array<T> & ArrayMapper<T>;    //type aliasing together with intersection types(&)
//Remark: need to put cursor to Condition<...> and press Ctrl + Q to see this info:
/**
 * Condition of removing item
 * @param value Represent a item to remove
 * @param predicate Function to set up condition of checking that @value exists in the DictionaryArray<T>
 * @param selector Function to adjust how to get key(string) to remove item from DictionaryArray<T>
 */
export type Condition<T> = {value: T, predicate: Predicate<T>, selector: Selector<T>};

export default class DictionaryArray<T> implements IDictionaryArray<T>{
    //private source: { [index:string]: T; } | { [index:number]: T; };      //it's possible to use this object notation
    private source: IDictionary<T> | Array<T>;
    get dictionary(){return this.toDictionary();}
    //pairs: IKeyValuePair<T> = {keyValuePairs: []};
    get array(): Array<T>{return this.toArray();}

    //mixin(intersection types T1 & T2)
    static convertArray<T, T1 extends Array<T>, T2 extends ArrayMapper<T>>(instance1: T1, instance2: T2) : T1 & T2 {
        let result = <T1 & T2>{};
        Object.keys(instance1).forEach(p => (<any>result)[p] = (<any>instance1)[p]);
        Object.keys(instance2).forEach(p => (result as any)[p] = (instance2 as any)[p]);
        return result;
    }

    //User-Defined Type Guards - https://www.typescriptlang.org/docs/handbook/advanced-types.html
    isArrayConverter(source: IDictionary<T> | ArrayConverter<T>): source is ArrayConverter<T>{
        return (<ArrayConverter<T>>source).mapper !== undefined;
    }
    convertObjectLiteralToArray<T>(obj: any) : T[]{
        let result:T[] = [];
        Object.keys(obj).forEach(p => result.push(obj[p]));
        return result;
    }

    constructor(source: IDictionary<T> | ArrayConverter<T>){
        if(this.isArrayConverter(source)){
            this.source = {};
            let {mapper, ...array} : {mapper: KeyValuePairTransformer<T>} = source;     //Note: destruction - https://www.typescriptlang.org/docs/handbook/variable-declarations.html
            array = this.convertObjectLiteralToArray(array);        //transform object literal to array
            if(array instanceof Array) {
                array.map(item => mapper(item)).forEach(keyValuePair => this.add(keyValuePair));
                //Object.keys(array).map((item: string) => mapper((<Array<T>>array)[item as any])).forEach(keyValuePair => this.add(keyValuePair)); //do the same
            }
            // else     //Workaround: in case if we do not get array from mixin
            //     Object.keys(source)
            //         .filter(p => p !== 'mapper')        //exclude mapper mixin's property from source array items(separation of mixin here)
            //         .map(p => source.mapper(source[p as any]))
            //         .forEach(keyValuePair => this.add(keyValuePair));
        }
        else
            this.source = source;
    }

    get length(): number{
        return this.array ? Object.keys(this.array).length : 0;     //https://learn.javascript.ru/array-methods#object-keys-obj
    }

    private get checkSource(){return this.source != undefined && this.source != null;}
    private toArray(): T[]{
        if(!this.checkSource) return [];
        let array:any = this.source;    //Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
        return Object.keys(array).map(prop => array[prop]);
    }
    // private toKeyValuePairs(): { key: T; }[] {
    //     if(!this.checkSource) return [];
    //     let dictionary:any = this.source;//Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
    //     return Object.keys(dictionary).map(key => {return {key: dictionary[key]};});
    // }
    private toDictionary(): IDictionary<T>/*{[key: string]: T}*/ {      //transformation to indexed object
        if(!this.checkSource) return {};
        let dictionary:any = {};//Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
        let collection:any = this.source;//Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
        Object.keys(this.source).map(key => dictionary[key]=collection[key]);
        return dictionary as {[key: string]: T};
    }

    private cast<U extends IDictionary<T> | Array<T>>(): U{     //Note: generic constraint - <U extends IDictionary<T> | Array<T>>
        return <U>this.source;
    }

    contains(keyIndexCondition: string|number|Condition<T>,){
        if(typeof keyIndexCondition === "string")
            return this.cast<IDictionary<T>>()[keyIndexCondition] != undefined;
        else if (typeof keyIndexCondition === "number")
            return this.cast<Array<T>>()[keyIndexCondition] != undefined;
        // else{
        //     console.log(this.array.indexOf(keyIndexValue));
        //     return this.array.indexOf(keyIndexValue) !== -1;
        // }
        else if(keyIndexCondition!.predicate)       //TODO: !.
            return this.array.some(item => keyIndexCondition.predicate(item));      //may use find() instead some()
        return false;
    }
    add(keyValuePair: {keyIndex: number|string, value: T}){
        if(!keyValuePair && !keyValuePair.keyIndex)
            throw Error(`Key or index is not provided`);
        let keyIndex = keyValuePair.keyIndex;
        let value = keyValuePair.value;
        if(typeof keyIndex === "string") {
            if(this.contains(keyIndex))
                throw Error(`Item with key: ${keyIndex} is already there`);
            this.cast<IDictionary<T>>()[keyIndex] = value;
        }
        else if(typeof keyIndex === "number"){
            if(this.contains(keyIndex))
                throw Error(`Item with an index[${keyIndex}] is already there`);
            this.cast<Array<T>>()[keyIndex] = value;
        }
    }
    remove(index:number):void;
    remove(key:string):void;
    remove(condition: Condition<T>): void;
    remove(keyIndexCondition: number|string|Condition<T>){
        if(this.contains(keyIndexCondition)) {
            if (typeof keyIndexCondition === "number")
                delete this.cast<Array<T>>()[keyIndexCondition];
            else if (typeof keyIndexCondition === "string")
                delete this.cast<IDictionary<T>>()[keyIndexCondition];
            else if (keyIndexCondition) {
                // let index = this.getIndex(keyIndexCondition);       //Note: won't work when array items is KeyValuePairs because 'index' will have number type even if a source item must be accessed by string key
                // delete this.cast<Array<T>>()[index];
                let item = this.getItem(keyIndexCondition);
                delete this.cast<IDictionary<T>>()[keyIndexCondition.selector(item)];
            }
        }
    }
    getIndex(condition: Condition<T>):number{
        if(!this.contains(condition)) return undefined;
        return this.array.indexOf(this.getItem(condition));
    }
    getItem(condition: Condition<T>):T{
        if(!this.contains(condition)) return undefined;
        return this.array.filter(condition.predicate)[0];
    }
}