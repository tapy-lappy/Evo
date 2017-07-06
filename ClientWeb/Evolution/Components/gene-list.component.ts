import {Component} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {BaseGeneComponent} from "../Abstract/base-gene.component";

@Component({
    moduleId: module.id,
    selector: 'gene-list-component',
    templateUrl: '../Html/gene-list.component.html'
})
export class GeneListComponent extends BaseGeneComponent {

    constructor(private appState: AppState) {
        super();
    }

    get geneList(){
        return this.appState.state.selectedGenes.geneArray;
    }
}