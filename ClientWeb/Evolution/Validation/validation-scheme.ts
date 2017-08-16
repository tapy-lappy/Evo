import {ValidationControlsScheme, ValidationControl, ValidationErrorMessage, ErrorAccumulator} from "../Abstract/interfaces";
import {Injectable, InjectionToken} from "@angular/core";

@Injectable()
export class ControlErrors implements ErrorAccumulator{
    [controlName: string]: string;
}
export const CONTROL_ERRORS_TOKEN =  new InjectionToken<ControlErrors>('validation-scheme');

@Injectable()
export class ValidationScheme implements ValidationControlsScheme{
    [controlName: string]: ValidationControl;
    'description': ValidationControl = {
        'required': <ValidationErrorMessage>{
            'message': 'Required field'
        },
        minlength: {
            message: 'Must be at least 4 characters long.'
        },
        maxlength: {
            message: 'Can\'t be more than 50 characters long.'
        },
        forbidden: {
            message: 'Value is forbidden.'          //TODO: what exactly value - implementation
        }
    }
}
export const VALIDATION_SCHEME_TOKEN =  new InjectionToken<ValidationScheme>('validation-scheme');