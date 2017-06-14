import {Injectable} from "@angular/core";
import {DnaEnum} from "../Enums/dna-enum";
import {SiteEnum} from "../Enums/site-enum";

@Injectable()
export default class DnaHelper{
    static getDnaName(dna:DnaEnum):string{
        return DnaEnum[dna];
    }
    //TODO: generic to have one method to process getting enum name, because this code is repeatable
    static getSiteName(site:SiteEnum): string{
        return SiteEnum[site];
    }
}