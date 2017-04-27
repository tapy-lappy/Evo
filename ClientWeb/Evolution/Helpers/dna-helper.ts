import {Injectable} from "@angular/core";
import {DnaEnum} from "../Enums/dna-enum";

@Injectable()
export default class DnaHelper{
    static getDnaName(dna:DnaEnum):string{
        return DnaEnum[dna];
    }
}