import {SiteEnum} from "../Enums/site-enum";
import EnumHelper from "../Helpers/enum-helper";

export default class Site {
    site: SiteEnum;
    isMutated: boolean;

    get name(): string{
        return EnumHelper.getEnumNameByValue(SiteEnum, this.site);
    }

    constructor(site:SiteEnum){ this.site = site;}

    setSiteCssClasses(){
        return {
            'site-mutated': this.isMutated
        };
    }
}