import { Injectable } from '@angular/core';

@Injectable()
export class ArrayHelper<T> {

    addTo(value: T, array: Array<T>){
        if (value && array && !array.some(v => v == value))
            array.push(value);
    }
    removeFrom(value: T, array: Array<T>){
        if (value && array && array.some(v => v == value)) {
            return array.filter(v => v != value);       //create new array instance based on prev array
        }
        return array;
    }
    static some<T>(array: Array<T>, predicate: (item:T)=>boolean):boolean{
        //https://metanit.com/web/javascript/4.8.php
        return array.some.call(array, predicate);
    }
    //TODO: JS context set up: this: void
    //some<T>(callbackfn: (this: void, value: T, index: number, array: T[]) => boolean): boolean;

    //Remark - useles in this form:
    // static cast<T>(array:T): T{
    //     return <T>array;
    // }
}