import {Component, EventEmitter, Output} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {DnaComponent} from "../Abstract/DnaComponent";
import {DnaEnum} from "../Enums/dna-enum";

@Component({
    moduleId: module.id,
    selector: 'dna-list-component',
    templateUrl: '../Html/dna-list.component.html'
})
export class DnaListComponent extends DnaComponent {

    constructor(private appState: AppState) {
        super();
    }

    get dnaList(){
        return this.appState.state.selectedDnas;
    }

    @Output('remove') removeEvent = new EventEmitter<DnaEnum>();
    removeGene(dna:DnaEnum)
    {
        //TODO: here must be readdressing work to dna-selector.component by using routing(because right now it's a bubble event raising!!!)
        this.removeEvent.emit(dna);
    }
}