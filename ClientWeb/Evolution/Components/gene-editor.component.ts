import {Component, OnDestroy} from '@angular/core';
import Gene from "../Models/gene";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

@Component({
    moduleId: module.id,
    selector: 'gene-editor',
    templateUrl: '../Html/gene-editor.component.html'
})

export class GeneEditorComponent implements OnDestroy {
    // get geneName() {return this.gene.name;}
    // get geneDescription() {return this.gene.description;}
    name: string;
    private subscription: Subscription;
    constructor(/*public gene:Gene*/private activeRoute: ActivatedRoute) {
        //this.name = activeRoute.snapshot.params['geneName'];
        //http://disq.us/p/1ebfmd9
        /*Remark: Angular creates only one instance of GeneEditorComponent to process all the routes connected with
        Remark: this component. So to catch router's params changes we use subscription onto changing router's parameter*/
        //https://angular.io/guide/router#observable-params-and-component-reuse
        //Quote: By default, the router re-uses a component instance when it re-navigates to the same component type without visiting a different component first. The route parameters could change each time.
        this.subscription = activeRoute.params.subscribe((params:Params) => this.name=params['geneName']);

        // (+) converts string 'id' to a number
        //+params['id']
    }

    ngOnDestroy(): void {
        //https://metanit.com/web/angular2/7.3.php
        this.subscription.unsubscribe();
    }
}
