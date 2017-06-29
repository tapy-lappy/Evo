import {SiteEnum} from "../Enums/site-enum";
import GeneHelper from "../Helpers/gene-helper";

export default class Site {
    site: SiteEnum;
    isMutated: boolean;

    get name(): string{
        return GeneHelper.getSiteName(this.site);
    }

    constructor(site:SiteEnum){ this.site = site;}

    setSiteCssClasses(){
        return {
            'site-mutated': this.isMutated
        };
    }
}