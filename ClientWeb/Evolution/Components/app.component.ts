//Code -> Insert Live Template (Ctrl + J)
import {Component, OnInit, ViewChild} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {ArrayHelper} from "../Helpers/array-helper";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import {GeneSelectorComponent} from "./gene-selector.component";
import GeneInteractionService from "../Services/gene-interaction.service";
import {SiteInteractionService} from "../Services/site-interaction.service";
import Gene from "../Models/gene";
import {
    DiscriminatedEnum1, DiscriminatedEnum3, DiscriminatedEnums, Enum3,
    getEnumValue
} from "../Common/DiscriminatedUnion";

@Component({
    moduleId: module.id,
    selector: 'evolution-main',
    templateUrl: '../Html/app.component.html',
    styles: [String(require('../Css/common-background.less'))],
    providers: [ArrayHelper, GeneInteractionService, SiteInteractionService]     //used into child components, but it's a helper, so must be a singleton. This is why it's here
})
export class AppComponent extends BaseGeneComponent implements OnInit{

    constructor(private appState: AppState, private geneInteraction: GeneInteractionService){
        super();
        this.setToogleMutationClasses();
    }

    ngOnInit(): void {
        this.mutationEnabled = this.appState.state.mutationEnabled;
        this.geneInteraction.geneRemoved$.subscribe(      //TODO: do we really need to subscribe in app.component? I suppose would be better to subscribe inside GeneSelectorComponent itself
            gene => this.removeFromDnaSelector(gene),
            error => this.error(error)
        );
    }

    toogleMutation() {
        this.mutationEnabled = !this.mutationEnabled;
        this.appState.state.mutationChange(this.mutationEnabled);
        this.setToogleMutationClasses();
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

    @ViewChild(GeneSelectorComponent)        //https://metanit.com/web/angular2/2.9.php
    dnaSelectorComponent: GeneSelectorComponent;
    removeFromDnaSelector(gene:Gene){
        this.dnaSelectorComponent.remove(gene);
    }
}