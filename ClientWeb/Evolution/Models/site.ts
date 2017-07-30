import {SiteEnum} from "../Enums/site-enum";
import EnumHelper from "../Helpers/enum-helper";

export default class Site {
    site: SiteEnum;
    isMutated: boolean;
    id: Symbol;

    get name(): string{
        return EnumHelper.getEnumNameByValue(SiteEnum, this.site);
    }

    constructor(site:SiteEnum, mutated?:boolean){
        this.site = site;
        this.id = Symbol(this.site);
        this.isMutated = mutated || false;
    }

    setSiteCssClasses(){
        return {
            'site-mutated': this.isMutated
        };
    }
}