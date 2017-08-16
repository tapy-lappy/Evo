import {Injectable, Provider} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {ErrorAccumulator, ValidationControlsScheme} from "../Abstract/interfaces";
import {CONTROL_ERRORS_TOKEN, VALIDATION_SCHEME_TOKEN} from "./validation-scheme";

@Injectable()
export class FormValidator{
    constructor(private form: FormGroup, private errorAccumulator: ErrorAccumulator, private validationScheme: ValidationControlsScheme){
    }

    //file:///G:/Angular/v2.angular.io/docs/ts/latest/cookbook/form-validation.html  Committing hero value changes
    //The 'data' object passed into onValueChanged() contains the current element values. The handler ignores them.
    onValueChanged(data?: any) : ErrorAccumulator {
        console.log(JSON.stringify(data));
        if (!this.form) { return this.errorAccumulator; }
        for (const controlName in this.errorAccumulator) {
            // clear previous error message (if any)
            this.errorAccumulator[controlName] = '';
            const control = this.form.get(controlName);
            if (control && (control.dirty || control.touched) && control.invalid) {
                const messages = this.validationScheme[controlName];
                for (const key in control.errors) {
                    this.errorAccumulator[controlName] += messages[key].message + ' ';
                }
            }
        }
        return this.errorAccumulator;
    }
}

export const formValidatorProvider: Provider ={
    provide: FormValidator,
    useFactory: (form: FormGroup, errorAccumulator: ErrorAccumulator, validationScheme: ValidationControlsScheme) => {
        return new FormValidator(form, errorAccumulator, validationScheme);
    },
    deps: [FormGroup, CONTROL_ERRORS_TOKEN, VALIDATION_SCHEME_TOKEN]
}