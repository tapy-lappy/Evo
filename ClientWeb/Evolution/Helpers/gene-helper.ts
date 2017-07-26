import {Injectable} from "@angular/core";
import {SiteEnum} from "../Enums/site-enum";

//TODO: only for test & development purpose. MUST BE REMOVED!
interface Map<T> {
    [key: string]: T;
}
class Test{
    name: string;
    age: number;
}


@Injectable()
export default class GeneHelper{
    //TODO: generic to have one method to process getting enum name, because this code is repeatable
    //Done
    //TODO: needed refactoring - apply new generic function getEnumNameByValue instead of this one:
    static getSiteName(site:SiteEnum): string{
        return SiteEnum[site];
    }


    // //static getSiteName<T extends number>(enumValue: T): string{         //{[key: string]: T}
    // static getSiteName<T, K extends keyof T>(enumValue: K): /*keyof T*/ T[K]{
    //     //return SiteEnum[enumValue];   //work but not generic
    //     //let key: keyof T = (<T>enumValue)[<K>enumValue];
    //
    //
    //     let value: keyof T = T[enumValue];            //CHECK!
    //     //return enumType[enumValue];         //returns SiteEnum.A, not a string       static getSiteName<T, K extends keyof T>(enumType: T, enumValue: K): /*keyof T*/ T[K]{
    //
    //
    //     //return (<T>enumValue)[(<K>enumValue)];      //undefined
    //
    //     // let keys: keyof {[key: string]: T};
    //     // let value: Map<number>['A'];
    //
    //     // let dict:Map<number> = {
    //     //     "AOR": 89,
    //     //     "AOR12": 78,
    //     // }
    //     // let dictKeys: keyof Test;       //undefined
    //     // let keys1: keyof Map<number>;   //undefined
    //     // let value: Map<number>['foo'];  //undefined
    //
    //     // let keys: keyof Map<number> = dict.toString(); // string
    //     // let value: Map<number>['does not matter what will be here'] = dict["AOR"]; // number
    //
    //         // console.log(typeof enumValue);  //number
    //         // console.log(GeneHelper.getNames(typeof enumValue)); //["n", "u", "m", "b", "e", "r"]
    //     //return GeneHelper.getNames(enumValue)[0];
    // }



    //TODO: how to use with enums this approach: https://www.typescriptlang.org/docs/handbook/advanced-types.html  - see Index types
    //TODO:     let name: string = getProperty(person, 'name');
    //TODO:     let age: number = getProperty(person, 'age');
    // static getProperty<T, K extends keyof T>(object: T, propertyName: K): T[K]{
    //     return object[propertyName];
    // }
    //Done:
    /*
    * Sample of call:
    * let value = GeneHelper.getEnumValueByName(SiteEnum, 'G');
    *
    * T - it's enum type, enumName:K - it's a string T[K] - it's number
    * */
    static getEnumValueByName<T, K extends keyof T>(enumType:T, enumName: K): T[K]{
        return enumType[enumName];
    }

    /*
    Sample of call:
    * let name = GeneHelper.getEnumNameByValue(SiteEnum, 3);
    * let name2 = GeneHelper.getEnumNameByValue(SiteEnum, SiteEnum.U);
    *
    * T - it's number OR enum item, enumValue:T - it's number OR enum item, keyof T - it's string
    * */
    static getEnumNameByValue<T extends number>(enumType:any, enumValue:T): keyof T{
        return enumType[enumValue];
    }

    //Note: the only one possible way to work with enums in generic way - it's to send type of enum as parameter.
    //https://stackoverflow.com/a/18112157 - explanation of problem
    //https://stackoverflow.com/a/21294925 - implementation from there:
    //Approach: imposible to use T istead of any here, as following: static getNamesAndValues<T extends number>(enumType: T)
    //Approach: because when you will call this method with enum type, as following: GeneHelper.getNamesAndValuesInOneArray(SiteEnum);
    //Approach: you will get: Error:(30, 58) TS2345:Argument of type 'typeof SiteEnum' is not assignable to parameter of type 'number'.
    //Approach: so, type guard <T extends number> here just to cast to specific type "as T".
    static getNamesAndValues<T extends number>(enumType: any) {     //Note: enum's type guard: <T extends number>
        return GeneHelper.getNames(enumType).map(n => ({ name: n, value: enumType[n] as T }));
    }
    static getNamesAndValuesInOneArray(enumType:any): (number | string)[]{
        // let items = [];
        // for (let site in enumType) {
        //     items.push(enumType[site]);
        // }
        // return items;
        //OR just the same:
        return GeneHelper.getObjValues(enumType);
    }

    static getNames(enumType: any): string[] {
        return GeneHelper.getObjValues(enumType).filter(v => typeof v === "string") as string[];
    }

    static getValues<T extends number>(enumType: any): T[] {
        return GeneHelper.getObjValues(enumType).filter(v => typeof v === "number") as T[];
    }

    private static getObjValues(enumType: any): (number | string)[] {
        return Object.keys(enumType).map(k => enumType[k]);
    }
}