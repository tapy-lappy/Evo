//import {InjectionToken} from "@angular/core";
import Gene from "./gene";
import {ArrayHelper} from "../Helpers/array-helper";
import {Observable} from "rxjs/Observable";
import DictionaryArray, {Condition, KeyValuePair} from "../Abstract/DictionaryArray";
import Site from "./site";
import {SiteEnum} from "../Enums/site-enum";

// enum GeneEnum{
//     Human = 48, Ape = 24, Worm = 8, Jellyfish = 16, Unknown = -1
// }

//const GENE_ENUM_TOKEN = new InjectionToken<GeneEnum>('gene-Enum');

//export {GENE_ENUM_TOKEN, GeneEnum}
type ErrorOptions = {
    gene: Gene,
    message: string,
    internalError?: Error
}

export default class GeneStorage{
    private _genes: DictionaryArray<Gene>;
    get geneArray(): Gene[]{
        return this._genes.array;
    }
    get geneDictionary(){
        return this._genes.dictionary;
    }

    constructor(...genes: Array<Gene>) {
        this._genes = new DictionaryArray(genes, this.createKeyValue);
    }

    private execute(callback: (param: KeyValuePair) => void,
                    param: KeyValuePair,
                    error: (option: ErrorOptions) => never,
                    errorOption?: ErrorOptions): this{
        try{
            callback(param);
        }catch(err){
            errorOption.internalError = err;
            error(errorOption);
        }
        return this;
    }

    createKeyValue(gene:Gene):KeyValuePair{
        let keyValue: KeyValuePair = {keyIndex: gene.name, value: gene};
        return keyValue;
    }
    add(gene: Gene): this{
        //TODO: this context in function/objects in JS - use metanit source explanation
        //Remark: here we bind context to callback function this._genes.add, because without this it won't know with what this._genes instance it must work
        return this.execute(this._genes.add.bind(this._genes), this.createKeyValue(gene), this.error, this.errorOption(gene, 'has been already added'));
    }
    remove(gene: Gene){
        //Remark: here we bind context to callback function this._genes.remove, because without this it won't know with what this._genes instance it must work
        //return this.execute(this._genes.remove.bind(this._genes), this.createKeyValue(gene), this.error, this.errorOption(gene, 'has already been removed'));
        let condition:Condition<Gene> = {
            value: gene,
            predicate: (g: Gene)=>g.name === gene.name,
            selector: (g: Gene)=>g.name
        };
        this._genes.remove(condition);   //Remark: direct call(do not need to bind context)
        return this;
    }

    errorOption(gene:Gene, message: string){
        return {gene: gene, message: message};
    }
    error(option: ErrorOptions):never{
        let errorMessage = `${option.gene.name} ${option.message}.`;
        if(option.internalError) errorMessage += `Internal error: ${option.internalError}`;
        throw Error(errorMessage);
    }
}

