import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {ValidationErrorMessage} from "../Abstract/interfaces";

// static forbidden(nameRegex: RegExp): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} => {
//         const no = nameRegex.test(control.value);
//         return no ? {'forbidden': <ValidationErrorMessage>{message: control.value}} : null;
//     };
// }
export const ForbiddenValidator = (nameRe: RegExp): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null/*{[key: string]: any}*/ => {
        const equal:boolean = nameRe.test(control.value);
        return equal ? {forbidden: true} : null;
    };
}