import {GeneEnum} from "../Enums/gene-enum";
import {Input} from "@angular/core";
import GeneHelper from "../Helpers/gene-helper";
import {SiteEnum} from "../Enums/site-enum";

export abstract class BaseGeneComponent {
    @Input() mutationEnabled: boolean = false;

    protected stopPropagation(event: Event){
        event.stopPropagation();
    }

    getGeneName(dna:GeneEnum):string{
        return GeneHelper.getGeneName(dna);
    }
    getSiteName(site:SiteEnum):string{
        return GeneHelper.getSiteName(site);
    }

    //The never type represents the type of values that never occur.        https://www.typescriptlang.org/docs/handbook/basic-types.html
    error(message: string): never;
    error(message: Error): never;
    error(message: string | Error): never{
        if (typeof message == 'string')
            throw new Error(message);
        else if(message instanceof Error)
            throw message;

        //Function returning 'never' cannot have a reachable end point. So, do it unreachable:
        const errorMessage = `Unknown error ${message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}