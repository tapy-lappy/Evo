import { Component } from '@angular/core';
import {ArrayHelper} from "../Helpers/array-helper";
import {AppState} from "../AppState/app-state";
import {GeneEnum} from "../Enums/gene-enum";
import {BaseGeneComponent} from "../Abstract/base-gene.component";

@Component({
    moduleId: module.id,
    selector: 'gene-selector-component',
    templateUrl: '../Html/gene-selector.component.html',
    styles: [String(require('../Css/gene-selector.component.css'))],
})
export class GeneSelectorComponent extends BaseGeneComponent {

    constructor(private appState: AppState, private arrayHelper: ArrayHelper<GeneEnum>) {
        super();
    }

    get availableDnas(): GeneEnum[]{
        return this.appState.state.availableDnas;
    }

    get selectedDnas(): GeneEnum[]{
        return this.appState.state.selectedDnas;
    }

    get hasAvailableDna(){
        return this.availableDnas.length > 0;
    }

    get hasSelectedDna(){
        return this.selectedDnas.length > 0;
    }

    add(dna: GeneEnum){
        this.arrayHelper.addTo(dna, this.selectedDnas);
        this.appState.state.availableDnas = this.arrayHelper.removeFrom(dna, this.appState.state.availableDnas);
    }
    remove(dna: GeneEnum)
    {
        this.arrayHelper.addTo(dna, this.availableDnas);
        this.appState.state.selectedDnas = this.arrayHelper.removeFrom(dna, this.appState.state.selectedDnas);
    }

}