import MutationService from "../Services/mutation.service";
import GeneService from "../Services/gene.service";
import {GeneEnum, GENE_ENUM_TOKEN} from "../Enums/gene-enum";

let geneServiceFactory = (dna: GeneEnum, mutationService: MutationService): GeneService =>{
    let service = new GeneService(dna, mutationService);
    return service;
};

export const geneServiceProvider = {
    provide: GeneService,
    useFactory: geneServiceFactory,
    deps: [ GENE_ENUM_TOKEN, MutationService ]        //the sequence is IMPORTANT! - need to match sequence of factory function params
};