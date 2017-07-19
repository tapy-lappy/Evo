//Code -> Insert Live Template (Ctrl + J)
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {ArrayHelper} from "../Helpers/array-helper";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import {GeneSelectorComponent} from "./gene-selector.component";
import {InteractEvent, MultiCastEvent} from "../Services/event-interaction.service";
import Gene from "../Models/gene";
import {
    DiscriminatedEnum1, DiscriminatedEnum3, DiscriminatedEnums, Enum3,
    getEnumValue
} from "../Common/DiscriminatedUnion";
import {Subscription} from "rxjs/Subscription";
import {
    GeneInteractionToken, RemoveGeneInteractionMultiCastEventToken,
    SiteInteractionToken
} from "../Services/di-interaction-service-tokens";

@Component({
    moduleId: module.id,
    selector: 'evolution-main',
    templateUrl: '../Html/app.component.html',
    styles: [String(require('../Css/common-background.less'))],
    providers: [ArrayHelper,
        //MultiCastEvent, InteractEvent,        //Error: provide ONLY one common shared SINGLETON instance for each components tree
        //Done: create one SINGLETON instance for specific token:
        {provide: SiteInteractionToken, useClass: InteractEvent},
        {provide: GeneInteractionToken, useClass: InteractEvent},
        {provide: RemoveGeneInteractionMultiCastEventToken, useClass: MultiCastEvent}
    ]     //used into child components, but it's a helper, so must be a singleton. This is why it's here
})
export class AppComponent extends BaseGeneComponent implements OnInit/*, OnDestroy*/{
    //This is a parent component and it controls lifetime of the service, so service automatically will die with this parent component
    //and we do not need to unsubscribe in ngOnDestroy():
    //private geneRemoved:Subscription;     //https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service

    constructor(private appState: AppState, private geneInteraction: RemoveGeneInteractionMultiCastEventToken<Gene>){
        super();
        this.setToogleMutationClasses();
    }

    ngOnInit(): void {
        this.mutationEnabled = this.appState.state.mutationEnabled;
        /*this.geneRemoved =*/ this.geneInteraction.generated$.subscribe(      //TODO: do we really need to subscribe in app.component? I suppose would be better to subscribe inside GeneSelectorComponent itself
            gene => this.removeFromDnaSelector(gene),
            error => this.error(error)
        );
    }
    // ngOnDestroy(): void {
    //     this.geneRemoved.unsubscribe();
    // }

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