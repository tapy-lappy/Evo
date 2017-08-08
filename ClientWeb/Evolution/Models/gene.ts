import Site from "./site";
import {Injectable, Optional} from "@angular/core";
import ObjectHelper from "../Helpers/object-helper";
import {ArrayHelper} from "../Helpers/array-helper";

@Injectable()       //Note: to make class accessible by using constructor with params in Angular
export default class Gene {
    id: Symbol;
    sites: Site[] = [];
    mutationSites: Site[] = [];
    name: string;
    description: string;


    get isMutated(){
        return this.mutationSites.length > 0 &&
            ArrayHelper.some(this.mutationSites, item=>item.isMutated);
    }

    constructor(name: string, sites: Site[], description?: string) {
        this.name = name;
        this.id = Symbol(this.name);
        this.sites = sites;
        this.description = description;
    }

    // constructor(parameters: {_name: string, _description: string, _sites: Site[]}) {
    //TODO: what is it? looks like spare/destruction operators, no?
    //Done: it's destruction(but actually it uses all the properties from 'parameters' object. So it's destruction, but without destruction :))
    //     let {_name, _description, _sites} = parameters; }

}