import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import Gene from "../Models/gene";
import {ArrayHelper} from "../Helpers/array-helper";
import {Subscription} from "rxjs/Subscription";
import {GeneInteractionToken} from "../Services/di-interaction-service-tokens";

@Component({
    moduleId: module.id,
    selector: 'gene-selector-component',
    templateUrl: '../Html/gene-selector.component.html',
    styles: [String(require('../Css/gene-selector.component.css'))],
})
export class GeneSelectorComponent extends BaseGeneComponent implements OnInit, OnDestroy{
    private errors: string[] = [];
    private geneAdded: Subscription;

    constructor(private appState: AppState, private geneInteraction: GeneInteractionToken<Gene,boolean>) {
        super();
    }

    ngOnInit(): void {
        this.geneAdded = this.geneInteraction.generated$
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
                        ArrayHelper.add<string>(this.errors, err.message);
                        //this.error(err);
                        success = false;
                    }
                    this.geneInteraction.confirm(success);
                },
                //  err => {
                //     this.error(err);            //catch error from .catch()
                //  }, //it's a handler for error processing FROM OBSERVABLE but not from SUBSCRIPTION
                //  () => {
                //     alert('Added!');
                // }       //Question: never perform. Why? Question: because it's a handler for completition FROM OBSERVABLE but not from SUBSCRIPTION
        );
    }
    ngOnDestroy(){
        this.geneAdded.unsubscribe();
    }

    get availableGenes(): Gene[]{
        return this.appState.state.availableGenes.geneArray;
    }

    get selectedGenes(): Gene[]{
        return this.appState.state.selectedGenes.geneArray;
    }

    get hasAvailableGenes(){
        return this.availableGenes.length > 0;
    }

    get hasSelectedGenes(){
        return this.selectedGenes.length > 0;
    }

    add(gene: string|Gene){
        if(typeof gene === 'string')    //type guard by typeof
            gene = this.appState.state.availableGenes.geneDictionary[gene];
        this.appState.state.selectedGenes.add(gene);
        this.appState.state.availableGenes.remove(gene);
    }
    remove(gene: string|Gene)
    {
        if(typeof gene === 'string')
            gene = this.appState.state.selectedGenes.geneDictionary[gene];
        this.appState.state.availableGenes.add(gene);
        this.appState.state.selectedGenes.remove(gene);
    }

}