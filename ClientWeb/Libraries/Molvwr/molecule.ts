import {Indexable} from "../../Evolution/Abstract/interfaces";
import {SiteEnum} from "../../Evolution/Enums/site-enum";
import Gene from "../../Evolution/Models/gene";

export class IndexedMolecula implements Indexable{
    index: number;
    molecula: SiteEnum | Gene;
}

export interface Molecula {
    title: string;
    formula: string;
    atoms: Array<any>;
    kinds: Array<any>;
};
//Remark: Merging class & interface here(without interface implementation)
export class Molecula implements Indexable{
    index: number;
    atoms = [];
    kinds = [];
}
export class Kind{
    name: string;
    symbol: string;
    rgb: string;
    invertedRGB: string;
}

//Also this module will be exported to molvwr.js, so using CommonJs module exports
module.exports = Molecula;

//TODO: clarify why need to use CommonJs approach(module.exports) for using Molecula in Molvwr.js if classes has been exportet with EXPORT CLASS - to use Molecula into Angular Components
//TODO: what the differences between import and require on ES6 - it cause error in Molvwr when IMPORT is used(https://stackoverflow.com/a/41300677)