import {Component, EventEmitter, Output} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import {GeneEnum} from "../Enums/gene-enum";

@Component({
    moduleId: module.id,
    selector: 'gene-list-component',
    templateUrl: '../Html/gene-list.component.html'
})
export class GeneListComponent extends BaseGeneComponent {

    constructor(private appState: AppState) {
        super();
    }

    get dnaList(){
        return this.appState.state.selectedDnas;
    }
}