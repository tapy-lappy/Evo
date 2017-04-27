import {InjectionToken} from "@angular/core";

export enum SiteEnum{
    A, C, G, T
}

 export const SITE_ENUMS_TOKEN =  new InjectionToken<SiteEnum>('site-Enum');
