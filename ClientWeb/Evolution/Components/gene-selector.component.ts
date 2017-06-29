import { Component } from '@angular/core';
import {AppState} from "../AppState/app-state";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import Gene from "../Models/gene";

@Component({
    moduleId: module.id,
    selector: 'gene-selector-component',
    templateUrl: '../Html/gene-selector.component.html',
    styles: [String(require('../Css/gene-selector.component.css'))],
})
export class GeneSelectorComponent extends BaseGeneComponent {

    constructor(private appState: AppState) {
        super();
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