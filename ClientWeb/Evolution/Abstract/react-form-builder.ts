import {FormArray, FormControl, FormGroup} from "@angular/forms";

export interface ReactFormBuilder{
    build<T>(...initializationData: any[]):FormGroup | FormArray | FormControl;
}