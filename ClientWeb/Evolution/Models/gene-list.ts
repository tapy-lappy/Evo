//import {InjectionToken} from "@angular/core";
import Gene from "./gene";
import {ArrayHelper} from "../Helpers/array-helper";
import {Observable} from "rxjs/Observable";

// enum GeneEnum{
//     Human = 48, Ape = 24, Worm = 8, Jellyfish = 16, Unknown = -1
// }

//const GENE_ENUM_TOKEN = new InjectionToken<GeneEnum>('gene-Enum');

//export {GENE_ENUM_TOKEN, GeneEnum}

//Remark: object indexed by strings(string index array): this._genes['gene_name']
interface GeneDictionary{
    [key: string]: Gene;
}

export default class GeneList{
    private arrayHelper = new ArrayHelper<Gene>();
    private _genes: GeneDictionary = {} as GeneDictionary; //Gene[] = [];
    //TODO: we need better solution than having two genes collections: array & dictionary
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
        //if(!this._genes.some(g => g.name === gene.name))      //this._genes.find(g => g.name === gene.name)
        //    this.arrayHelper.addTo(gene, this._genes);
        if(!this.contains(gene))
            this._genes[gene.name] = gene;
        else this.error(gene, 'has been already added.');
        return this;
    }
    remove(gene: Gene){
        // if(this._genes.some(g => g.name === gene.name))
        //     this.arrayHelper.removeFrom(gene, this._genes);
        if(this.contains(gene)) {
            //this._genes[gene.name] = undefined;         //TODO: need to fully remove key-value pair, not leaving key-undefined
            delete this._genes[gene.name];                //Done
            // console.log(this._genes);
            // console.log(Object.keys(this._genes));     //https://learn.javascript.ru/array-methods#object-keys-obj
        }
        return this;
    }

    contains(gene: Gene): boolean{
        return this._genes[gene.name] != undefined;
    }

    error(gene: Gene, message?: string):never{
        throw Error(`${gene.name} ${message}`);
    }
}

