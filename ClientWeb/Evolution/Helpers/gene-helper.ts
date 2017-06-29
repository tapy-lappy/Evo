import {Injectable} from "@angular/core";
import {SiteEnum} from "../Enums/site-enum";

@Injectable()
export default class GeneHelper{
    //TODO: generic to have one method to process getting enum name, because this code is repeatable
    static getSiteName(site:SiteEnum): string{
        return SiteEnum[site];
    }
}