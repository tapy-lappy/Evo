import {SiteEnum} from "../Enums/site-enum";

export default class Site {
    site: SiteEnum;
    isMutated: boolean;

    get name(): string{
        return SiteEnum[this.site];
    }

    setSiteCssClasses(){
        return {
            'site-mutated': this.isMutated
        };
    }

    constructor() { }

}