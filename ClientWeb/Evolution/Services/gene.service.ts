import {Injectable} from '@angular/core';
import MutationService from "./mutation.service";
import {GeneEnum} from "../Enums/gene-enum";
import Gene from "../Models/gene";
import {SiteEnum} from "../Enums/site-enum";
import Site from "../Models/site";
import GeneHelper from "../Helpers/gene-helper";
import {Resolvable} from "../Abstract/resolvable";

@Injectable()
export default class GeneService implements Resolvable{
    protected _gene: Gene;

    constructor(private geneItem: GeneEnum, private mutationService: MutationService) {
        let sites = this.getGeneSites();
        this._gene = new Gene(GeneHelper.getGeneName(this.geneItem), sites);
    }

    getGeneSites():Site[]{
        let sites: Site[] = [];
        for(let i=0; i<this.geneItem; i++ )
        {
            let site = new Site();
            let randomValue = Math.random();
            if(randomValue >= 0.8) site.site = SiteEnum.A;
            else if(randomValue >= 0.6) site.site = SiteEnum.C;
            else if(randomValue >= 0.4) site.site = SiteEnum.G;
            else if(randomValue >= 0.2) site.site = SiteEnum.T;
            else site.site = SiteEnum.U;

            sites.push(site);
        }
        return sites;
    }

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