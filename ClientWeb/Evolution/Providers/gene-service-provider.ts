import MutationService from "../Services/mutation.service";
import GeneService from "../Services/gene.service";
import {DnaEnum, DNA_ENUM_TOKEN} from "../Enums/dna-enum";

let geneServiceFactory = (dna: DnaEnum, mutationService: MutationService): GeneService =>{
    let service = new GeneService(dna, mutationService);
    return service;
};

export const geneServiceProvider = {
    provide: GeneService,
    useFactory: geneServiceFactory,
    deps: [ DNA_ENUM_TOKEN, MutationService ]        //the sequence is IMPORTANT! - need to match sequence of factory function params
};