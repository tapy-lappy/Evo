import { Component } from '@angular/core';
import {ArrayHelper} from "../Helpers/array-helper";
import {AppState} from "../AppState/app-state";
import {DnaEnum} from "../Enums/dna-enum";
import {DnaComponent} from "../Abstract/DnaComponent";

@Component({
    moduleId: module.id,
    selector: 'dna-selector-component',
    templateUrl: '../Html/dna-selector.component.html',
    styles: [String(require('../Css/dna-selector.component.css'))],
})
export class DnaSelectorComponent extends DnaComponent {

    constructor(private appState: AppState, private arrayHelper: ArrayHelper<DnaEnum>) {
        super();
    }

    get availableDnas(): DnaEnum[]{
        return this.appState.state.availableDnas;
    }

    get selectedDnas(): DnaEnum[]{
        return this.appState.state.selectedDnas;
    }

    get hasAvailableDna(){
        return this.availableDnas.length > 0;
    }

    get hasSelectedDna(){
        return this.selectedDnas.length > 0;
    }

    add(dna: DnaEnum){
        this.arrayHelper.addTo(dna, this.selectedDnas);
        this.appState.state.availableDnas = this.arrayHelper.removeFrom(dna, this.appState.state.availableDnas);
    }
    remove(dna: DnaEnum)
    {
        this.arrayHelper.addTo(dna, this.availableDnas);
        this.appState.state.selectedDnas = this.arrayHelper.removeFrom(dna, this.appState.state.selectedDnas);
    }

}