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

}