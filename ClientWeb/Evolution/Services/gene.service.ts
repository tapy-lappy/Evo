import {Injectable} from '@angular/core';
import MutationService from "./mutation.service";
import Gene from "../Models/gene";
import {SiteEnum} from "../Enums/site-enum";
import Site from "../Models/site";
import {Resolvable} from "../Abstract/resolvable";

@Injectable()
export default class GeneService implements Resolvable{
    constructor(private _gene: Gene, private mutationService: MutationService) {}

    // getGeneSites():Site[]{
    //     let sites: Site[] = [];
    //     for(let i=0; i<this.geneItem.sites.length; i++ )
    //     {
    //         let randomValue = Math.random();
    //         let siteItem:SiteEnum;
    //         if(randomValue >= 0.8) siteItem = SiteEnum.A;
    //         else if(randomValue >= 0.6) siteItem = SiteEnum.C;
    //         else if(randomValue >= 0.4) siteItem = SiteEnum.G;
    //         else if(randomValue >= 0.2) siteItem = SiteEnum.T;
    //         else siteItem = SiteEnum.U;
    //
    //         sites.push(new Site(siteItem));
    //     }
    //     return sites;
    // }

    get gene(): Gene{
        return this.checkMutation(this._gene, this.mutationService.isEnabled);
    }
    checkMutation(gene:Gene, isMutationEnabled:boolean){
        gene.mutationSites = [];
        if(!isMutationEnabled){
            return this._gene
        };
        let mutatedGene: Gene = this.mutationService.mutateGene(gene);
        return mutatedGene;
    }
    switchGeneMutation(gene:Gene, isMutationEnabled:boolean){
        this.mutationService.isEnabled = isMutationEnabled;
        this.checkMutation(gene, isMutationEnabled);
    }
}