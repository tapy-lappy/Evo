import {Component, OnDestroy} from '@angular/core';
import Gene from "../Models/gene";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {SiteEnum} from "../Enums/site-enum";
import {DnaComponent} from "../Abstract/DnaComponent";
import Site from "../Models/site";


@Component({
    moduleId: module.id,
    selector: 'gene-editor',
    styles: [String(require('../Css/gene-editor.component.less'))],
    templateUrl: '../Html/gene-editor.component.html'
})

export class GeneEditorComponent extends DnaComponent implements OnDestroy {
    private currentChosenSite: Site;
    //get diagnostic(){return JSON.stringify(this.gene);}
    private gene: Gene = new Gene('', [], '');      //TODO: create DI factory to initialize constructor of Gene with this empty values and then use it in component's constructor
    private validationMessageClasses = 'alert alert-danger';
    private submitted = false;


    private routerSubscription: Subscription;
    private querySubscription: Subscription;
    constructor(/*public gene:Gene*/private activeRoute: ActivatedRoute) {
        super();
        //https://metanit.com/web/angular2/7.3.php
        //this.gene.name = activeRoute.snapshot.params['name'];
        //http://disq.us/p/1ebfmd9
        /*Remark: Angular creates only one instance of GeneEditorComponent to process all the routes connected with
        Remark: this component. So to catch router's params changes we use subscription onto changing router's parameter*/
        //https://angular.io/guide/router#observable-params-and-component-reuse
        //Quote: By default, the router re-uses a component instance when it re-navigates to the same component type without visiting a different component first. The route parameters could change each time.
        this.routerSubscription = activeRoute.params.subscribe((params:Params) => this.gene.name=params['geneName']);
        this.querySubscription = activeRoute.queryParams.subscribe((params: Params) => {
            this.gene.description = params['description'];
            if(params['sites']) {
                let sites = JSON.parse(params['sites'].replace(/'/g, '"'));
                //https://learn.javascript.ru/array-iteration
                sites.forEach((site: any) => {           //map - to transform array to array of other items
                    this.gene.sites.push(<Site>site);
                });
            }
            else this.gene.sites = [];       //cleaning sites array to prevent accumulation
        });

        // (+) converts string 'id' to a number
        //+params['id']
    }

    ngOnDestroy(): void {
        //http://disq.us/p/1jkl0a7 - it's possible to do not unsubscribe:
        /*Quote:
         https://angular.io/guide/router#observable-params-and-component-reuse
         When subscribing to an observable in a component, you almost always arrange to unsubscribe when the component is destroyed.
         There are a few exceptional observables where this is not necessary. The ActivatedRoute observables are among the exceptions.
         The ActivatedRoute and its observables are insulated from the Router itself. The Router destroys a routed component when it is no longer needed and the injected ActivatedRoute dies with it.
         Feel free to unsubscribe anyway. It is harmless and never a bad practice.
         */
        this.routerSubscription.unsubscribe();
        this.querySubscription.unsubscribe();
    }

    add(){
        this.gene = new Gene(this.gene.name, [this.currentChosenSite], this.gene.description);
        this.currentChosenSite = undefined;
    }
    onSubmit(){
        this.submitted = true;
    }
}
