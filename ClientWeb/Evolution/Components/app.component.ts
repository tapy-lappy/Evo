//Code -> Insert Live Template (Ctrl + J)
import {Component, OnInit, ViewChild} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {ArrayHelper} from "../Helpers/array-helper";
import {DnaComponent} from "../Abstract/DnaComponent";
import {DnaEnum} from "../Enums/dna-enum";
import {DnaSelectorComponent} from "./dna-selector.component";
import DnaInteractionService from "../Services/dna-interaction.service";

//import * as MoleculeViewer from '../../Libraries/Molvwr/molvwr');

//require('../../Libraries/Molvwr/hand');
//require('expose-loader?HANDJS!../../Libraries/Molvwr/hand');

//let BABYLON = require('exports-loader?BABYLON!../../Libraries/Molvwr/babylon');
let BABYLON = require("expose-loader?BABYLON!../../Libraries/Molvwr/babylon");
//let Molvwr = require('../../Libraries/Molvwr/molvwr');
//import * as MoleculeViewer from '../../Libraries/Molvwr/molvwr');

//require("expose-loader?BABYLON!../../Libraries/Molvwr/molvwr");
 let MoleculeViewer = require("exports-loader?Molvwr,BabylonContext=Molvwr.BabylonContext!../../Libraries/Molvwr/molvwr");
 let $ = require("expose-loader?$!jquery");

@Component({
    moduleId: module.id,
    selector: 'evolution-main',
    templateUrl: '../Html/app.component.html',
    styles: [String(require('../Css/common-background.less'))],
    providers: [ArrayHelper, DnaInteractionService]     //used into child components, but it's a helper, so must be a singleton. This is why it's here
})
export class AppComponent extends DnaComponent implements OnInit{

    constructor(private appState: AppState, private dnaInteraction: DnaInteractionService){
        super();
        this.setToogleMutationClasses();
    }

    ngOnInit(): void {
        this.mutationEnabled = this.appState.state.mutationEnabled;
        this.dnaInteraction.dnaRemoved$.subscribe(
            dna => this.removeFromDnaSelector(dna),
            error => this.error(error));
    }

    toogleMutation() {
        this.mutationEnabled = this.appState.state.mutationEnabled = !this.mutationEnabled;
        this.setToogleMutationClasses();

        var canvas = $("#moleculeViewer").get(0);
        //MoleculeViewer.BabylonContext(canvas);
        MoleculeViewer.BABYLON = BABYLON;
        MoleculeViewer.Molvwr.process();
    }

    toogleMutationClasses: {};
    setToogleMutationClasses(){
        this.toogleMutationClasses = {
            btn: true,
            'btn-primary': this.mutationEnabled,
            'btn-info': !this.mutationEnabled,
            'btn-sm': true
        };
    }

    @ViewChild(DnaSelectorComponent)
    dnaSelectorComponent: DnaSelectorComponent;
    removeFromDnaSelector(dna:DnaEnum){
        this.dnaSelectorComponent.remove(dna);
    }
}