import {DnaEnum} from "../Enums/dna-enum";
import {Input} from "@angular/core";
import DnaHelper from "../Helpers/dna-helper";

export abstract class DnaComponent {
    @Input() mutationEnabled: boolean = false;

    getDnaName(dna:DnaEnum):string{
        return DnaHelper.getDnaName(dna);
    }
}