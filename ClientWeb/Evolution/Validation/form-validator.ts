import {Injectable, Provider} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {ErrorAccumulator, ValidationRulesScheme} from "../Abstract/interfaces";
import {ControlErrors, ValidationScheme} from "./validation-scheme";

@Injectable()
export class FormValidator{
    constructor(private form: FormGroup, private errorAccumulator: ErrorAccumulator, private validationScheme: ValidationRulesScheme){
    }

    //file:///G:/Angular/v2.angular.io/docs/ts/latest/cookbook/form-validation.html  Committing hero value changes
    //The 'data' object passed into onValueChanged() contains the current element values. The handler ignores them.
    onValueChanged(data?: any) : ErrorAccumulator {
        //console.log(JSON.stringify(data));
        if (!this.form) { return this.errorAccumulator; }
        for (const controlName in this.errorAccumulator) {
            // clear previous error message (if any)
            this.errorAccumulator[controlName] = '';
            const control = this.form.get(controlName);
            if (control && (control.dirty || control.touched) && control.invalid) {
                const rules = this.validationScheme.rules;
                for (const key in control.errors) {
                    this.errorAccumulator[controlName] += rules[key].error(rules[key]) + ' ';
                }
            }
        }
        return this.errorAccumulator;
    }
}

export const formValidatorProvider: Provider ={
    provide: FormValidator,
    useFactory: (form: FormGroup, errorAccumulator: ErrorAccumulator, validationScheme: ValidationRulesScheme) => {
        return new FormValidator(form, errorAccumulator, validationScheme);
    },
    deps: [FormGroup, ControlErrors, ValidationScheme]
}