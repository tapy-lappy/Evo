import {Component, OnInit} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import Gene from "../Models/gene";
import GeneInteractionService from "../Services/gene-interaction.service";
import {ArrayHelper} from "../Helpers/array-helper";
import {Observable} from "rxjs/Observable";

@Component({
    moduleId: module.id,
    selector: 'gene-selector-component',
    templateUrl: '../Html/gene-selector.component.html',
    styles: [String(require('../Css/gene-selector.component.css'))],
})
export class GeneSelectorComponent extends BaseGeneComponent implements OnInit{
    private errors: string[] = [];

    constructor(private appState: AppState, private geneInteraction: GeneInteractionService, private arrayHelper: ArrayHelper<string>) {
        super();
    }

    ngOnInit(): void {
        this.geneInteraction.geneAdded$
            // .do(()=>{
            //     console.log('Started adding new gene...');
            //     throw Error('Generate error');              //to make .catch() perform(or if you comment it - perform .subscribe() error processing handler)
            //     //return Observable.throw('=========');     //doesn't make .catch() working
            // })
            // .catch(err => {
            //     alert('Catch error');
            //     return Observable.throw(err);       //generate error again to catch it into .subscribe() error processing handler
            //     //return err;
            // })
            .subscribe(
                gene => {
                    let success = true;
                    try {
                        this.add(gene);
                    }catch (err)
                    {
                        this.arrayHelper.addTo(err.message, this.errors);
                        //this.error(err);
                        success = false;
                    }
                    this.geneInteraction.additionSuccesseed(success);
                },
                //  err => {
                //     this.error(err);            //catch error from .catch()
                //  }, //it's a handler for error processing FROM OBSERVABLE but not from SUBSCRIPTION
                //  () => {
                //     alert('Added!');
                // }       //Question: never perform. Why? Question: because it's a handler for completition FROM OBSERVABLE but not from SUBSCRIPTION
        );
    }

    get availableGenes(): Gene[]{
        return this.appState.state.availableGenes.genes;
    }

    get selectedGenes(): Gene[]{
        return this.appState.state.selectedGenes.genes;
    }

    get hasAvailableGenes(){
        return this.availableGenes.length > 0;
    }

    get hasSelectedGenes(){
        return this.selectedGenes.length > 0;
    }

    add(gene: string|Gene){
        if(typeof gene === 'string')
            gene = this.appState.state.availableGenes.genesIndexed[gene];
        this.appState.state.selectedGenes.add(gene);
        this.appState.state.availableGenes.remove(gene);
    }
    remove(gene: string|Gene)
    {
        if(typeof gene === 'string')
            gene = this.appState.state.selectedGenes.genesIndexed[gene];
        this.appState.state.availableGenes.add(gene);
        this.appState.state.selectedGenes.remove(gene);
    }

}