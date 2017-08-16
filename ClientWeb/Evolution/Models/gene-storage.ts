import Gene from "./gene";
import DictionaryArray, {ArrayConverter, ArrayMapper, Condition, KeyValuePair} from "../Common/DictionaryArray";
import {IDictionary} from "../Abstract/interfaces";

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
        let convertedArray = DictionaryArray.convertArray<Gene, Array<Gene>, ArrayMapper<Gene>>(genes || [], {mapper: this.createKeyValue});
        this._genes = new DictionaryArray<Gene>(convertedArray);

        // let dict:IDictionary<Gene> = {
        //     "AOR": new Gene("Aor", [], ''),
        //     "AOR12": new Gene("Aor", [], ''),
        // }
        // this._genes = new DictionaryArray<Gene>(dict);
    }

    private execute(callback: (param: KeyValuePair<Gene>) => void,
                    param: KeyValuePair<Gene>,
                    error: (option: ErrorOptions) => never,
                    errorOption?: ErrorOptions): this{
        try{
            callback(param);
        }catch(err){
            errorOption.internalError = err;
            error(errorOption);
        }
        return this;    //Polymorphic this types: https://www.typescriptlang.org/docs/handbook/advanced-types.html
    }

    createKeyValue(gene:Gene):KeyValuePair<Gene> {
        let keyValue: KeyValuePair<Gene> = {keyIndex: gene.name, value: gene};
        return keyValue;
    }
    add(gene: Gene): this{
        //Explanation: 'this' context in function/objects in JS: bind() function - https://metanit.com/web/javascript/4.10.php
        //Explanation: call()/apply() - https://metanit.com/web/javascript/4.8.php
        //Explanation: here we bind context to callback function this._genes.add, because without this it won't know with what this._genes instance it must work
        return this.execute(this._genes.add.bind(this._genes), this.createKeyValue(gene), this.error, this.errorOption(gene, 'has been already added'));
    }
    remove(gene: Gene){
        //Explanation: here we bind context to callback function this._genes.remove, because without this it won't know with what this._genes instance it must work
        //return this.execute(this._genes.remove.bind(this._genes), this.createKeyValue(gene), this.error, this.errorOption(gene, 'has already been removed'));
        let condition:Condition<Gene> = {
            value: gene,
            predicate: (g: Gene)=>g.name === gene.name,
            selector: (g: Gene)=>g.name
        };
        this._genes.remove(condition);   //Explanation: direct call(do not need to bind context)
        return this;        //Polymorphic this types: https://www.typescriptlang.org/docs/handbook/advanced-types.html
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

