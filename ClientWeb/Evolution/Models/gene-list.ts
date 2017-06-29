//import {InjectionToken} from "@angular/core";
import Gene from "./gene";
import {ArrayHelper} from "../Helpers/array-helper";

// enum GeneEnum{
//     Human = 48, Ape = 24, Worm = 8, Jellyfish = 16, Unknown = -1
// }

//const GENE_ENUM_TOKEN = new InjectionToken<GeneEnum>('gene-Enum');

//export {GENE_ENUM_TOKEN, GeneEnum}

//TODO: indexing by string: this._genes['gene_name']
interface GeneDictionary{
    [key: string]: Gene;
}

export default class GeneList{
    private arrayHelper = new ArrayHelper<Gene>();
    private _genes: GeneDictionary = {} as GeneDictionary; //Gene[] = [];
    get genesIndexed(){return this._genes;}
    get genes(): Gene[]{
        let result: Gene[] = [];
        for(let key in this._genes)
            if(this._genes[key])
                this.arrayHelper.addTo(this._genes[key], result);
        return result;
    }

    constructor(...genes: Array<Gene>) {
        if (genes) {
            //this._genes = genes;
            genes.forEach(g => this._genes[g.name] = g);
        }
    }

    add(gene: Gene): this{
        //if(!this._genes.some(g => g.name === gene.name))
        //    this.arrayHelper.addTo(gene, this._genes);
        if(!this._genes[gene.name])
            this._genes[gene.name] = gene;
        return this;
    }
    remove(gene: Gene){
        // if(this._genes.some(g => g.name === gene.name))
        //     this.arrayHelper.removeFrom(gene, this._genes);
        if(this._genes[gene.name])
            this._genes[gene.name] = undefined;
        return this;
    }
}

