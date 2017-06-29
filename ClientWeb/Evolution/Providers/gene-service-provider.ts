import MutationService from "../Services/mutation.service";
import GeneService from "../Services/gene.service";
import Gene from "../Models/gene";

let geneServiceFactory = (gene: Gene, mutationService: MutationService): GeneService =>{
    let service = new GeneService(gene, mutationService);
    return service;
};

export const geneServiceProvider = {
    provide: GeneService,
    useFactory: geneServiceFactory,
    deps: [ Gene, MutationService ]        //the sequence is IMPORTANT! - need to match sequence of factory function params
};