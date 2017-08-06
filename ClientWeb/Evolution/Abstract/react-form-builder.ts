import {FormArray, FormControl, FormGroup} from "@angular/forms";

// export interface ReactFormBuilder{
//     build<T>(initializationData?: any):FormGroup | FormArray | FormControl;
// }
export abstract class ReactFormBuilder{
    abstract build<T>(initializationData?: any):FormGroup | FormArray | FormControl;
}