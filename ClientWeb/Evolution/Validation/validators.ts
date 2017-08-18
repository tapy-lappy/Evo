import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const ForbiddenValidator = (nameRe: RegExp): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const equal:boolean = nameRe.test(control.value);
        return equal ? {forbidden: true} : null;
    };
}

//Using as: new FormArray([item1, item2...], MinSum(100))
export const MinSum = (value: number): ValidatorFn => {
    return (control: AbstractControl): {[key: string]: any} => {
        let sum = control.value
            .map((item: any) => item.quantity)              //TODO: type protection(don't relay on each any will have .quantity prop)
            .reduce((accumulator: number, current: number) => accumulator + current, 0);       //TODO: reduce
        return sum < value ? { minSum: value } : null;
    }
}