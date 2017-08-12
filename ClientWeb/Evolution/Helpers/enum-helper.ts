import {Injectable} from "@angular/core";

@Injectable()
export default class EnumHelper{
    //TODO: how to use with enums this approach: https://www.typescriptlang.org/docs/handbook/advanced-types.html  - see Index types
    //TODO:     let name: string = getProperty(person, 'name');
    //TODO:     let age: number = getProperty(person, 'age');
    // static getProperty<T, K extends keyof T>(object: T, propertyName: K): T[K]{
    //     return object[propertyName];
    // }
    //Done:
    /*
    * Sample of call:
    * let value = EnumHelper.getEnumValueByName(SiteEnum, 'G');
    *
    * T - it's enum type, enumName:K - it's a string, T[K] - it's number
    * */
    static getEnumValueByName<T, K extends keyof T>(enumType:T, enumName: K): T[K]{
        return enumType[enumName];
    }

    /*
    Sample of call:
    * let name = EnumHelper.getEnumNameByValue(SiteEnum, 3);
    * let name2 = EnumHelper.getEnumNameByValue(SiteEnum, SiteEnum.U);
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
    //Approach: because when you will call this method with enum type, as following: EnumHelper.getNamesAndValuesInOneArray(SiteEnum);
    //Approach: you will get: Error:(30, 58) TS2345:Argument of type 'typeof SiteEnum' is not assignable to parameter of type 'number'.
    //Approach: so, type guard <T extends number> here just to cast to specific type "as T".
    static getNamesAndValues<T extends number>(enumType: any) {     //Note: enum's type guard: <T extends number>
        return EnumHelper.getNames(enumType).map(n => ({ name: n, value: enumType[n] as T }));
    }
    static getNamesAndValuesInOneArray(enumType:any): (number | string)[]{
        // let items = [];
        // for (let site in enumType) {
        //     items.push(enumType[site]);
        // }
        // return items;
        //OR just the same:
        return EnumHelper.getObjValues(enumType);
    }

    static getNames(enumType: any): string[] {
        return EnumHelper.getObjValues(enumType).filter(v => typeof v === "string") as string[];
    }

    static getValues<T extends number>(enumType: any): T[] {
        return EnumHelper.getObjValues(enumType).filter(v => typeof v === "number") as T[];
    }

    private static getObjValues(enumType: any): (number | string)[] {
        return Object.keys(enumType).map(k => enumType[k]);
    }
}