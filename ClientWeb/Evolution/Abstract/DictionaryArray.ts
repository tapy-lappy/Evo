//https://stackoverflow.com/a/35370453
interface IDictionary<T>{
    [key: string]: T;
}
// interface IKeyValuePair<T>{
//     keyValuePairs: {key: T}[];
// }

interface IDictionaryArray<T>{
    dictionary: IDictionary<T>;
    array: Array<T>;
    length: number;
    //new (source: IDictionary<T> | Array<T>): IDictionaryArray<T>;      //constructon annotation in interface
}

export type KeyValuePair = {keyIndex: number|string, value: any};
export type Predicate<T> = (item1:T)=>boolean;
export type Selector<T> = (item:T)=>string;
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
    //readonly _dictionary: IDictionary<T> = {} as IDictionary<T>;
    get dictionary(){return this.toDictionary();}
    //pairs: IKeyValuePair<T> = {keyValuePairs: []};
    //readonly _array: Array<T> = {};
    get array(): Array<T>{return this.toArray();}
    //[key: string]: (key:string)=>T;           //string literal object(type)/associative array/string indexed object(interface)/dictionary which values are functions

    constructor(source: IDictionary<T> | Array<T>){
        this.source = source;
    }

    get length(): number{
        return this.array ? Object.keys(this.array).length : 0;     //https://learn.javascript.ru/array-methods#object-keys-obj
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

    cast<U extends IDictionary<T> | Array<T>>(): U{     //Note: generic constraint - <U extends IDictionary<T> | Array<T>>
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
        // if((typeof keyIndexValue === 'number' || typeof keyIndexValue === 'string') && !this.contains(keyIndexValue))
        //     throw Error(`Item with index/key: ${keyIndexValue} is absent`);
        if(this.contains(keyIndexCondition)) {
            if (typeof keyIndexCondition === "number")
                delete this.cast<Array<T>>()[keyIndexCondition];
            else if (typeof keyIndexCondition === "string")
                delete this.cast<IDictionary<T>>()[keyIndexCondition];
            else if (keyIndexCondition) {
                // let index = this.getIndex(keyIndexCondition);       //TODO: won't work when array items is KeyValuePairs
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