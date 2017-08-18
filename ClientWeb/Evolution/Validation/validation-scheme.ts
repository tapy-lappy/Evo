import {
    ValidationRulesScheme, ValidationRule, ErrorAccumulator,
    IDictionary
} from "../Abstract/interfaces";
import {Injectable} from "@angular/core";

@Injectable()
export class ControlErrors implements ErrorAccumulator{
    [controlName: string]: string;
}

@Injectable()
export class ValidationScheme implements ValidationRulesScheme{
    'rules': IDictionary<ValidationRule> = {
        'required': <ValidationRule>{
            'message': 'Required field',
            error: this.getError
        },
        minlength: {
            message: 'Must be at least {0} characters long.',
            error: this.getError
        },
        maxlength: {
            message: 'Can\'t be more than {0} characters long.',
            error: this.getError
        },
        forbidden: {
            message: 'Value "{0}" is forbidden.',
            error: this.getError
        }
    }
    getError(rule: ValidationRule):string{
        let placeholder = rule.value instanceof RegExp ? rule.value.source :
            (rule.value ? rule.value.toString() : undefined);
        return placeholder ?
            rule.message.replace(/\{0\}/g, placeholder) : rule.message;
    };
    setPlaceholders(settings: {rule: ValidationRule, value: number|string|RegExp}[]):void{
        settings.forEach(setting => {
            setting.rule.value = setting.value;
        });
    }
}