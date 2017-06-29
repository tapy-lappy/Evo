import {Injectable} from "@angular/core";
import {GeneEnum} from "../Enums/gene-enum";
import {SiteEnum} from "../Enums/site-enum";

@Injectable()
export default class GeneHelper{
    static getGeneName(dna:GeneEnum):string{
        return GeneEnum[dna];
    }
    //TODO: generic to have one method to process getting enum name, because this code is repeatable
    static getSiteName(site:SiteEnum): string{
        return SiteEnum[site];
    }
}