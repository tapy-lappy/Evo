import {NgModule, NO_ERRORS_SCHEMA, Type} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes, Route} from '@angular/router';
import { HttpModule } from '@angular/http';
import * as config from "../Config/app-config";
import LogService from "../Services/log.service";
import {AppComponent} from "../Components/app.component";
import {GeneComponent} from "../Components/gene.component";


import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { ApplicationRef } from '@angular/core';
import { AppState } from '../AppState/app-state';
import {GeneSelectorComponent} from "../Components/gene-selector.component";
import {GeneListComponent} from "../Components/gene-list.component";
import {SiteEnum, SITE_ENUMS_TOKEN} from "../Enums/site-enum";
//import {GeneEnum, GENE_ENUM_TOKEN, default as GeneStorage} from "../Enums/gene-enum";  //import default class as GeneStorage alias
import GeneList from "../Models/gene-storage";      //TODO: actually it was renamed to GeneStorage but because it's default exported class we may have different name here to represent that GeneStorage
import {HighlightDirective} from "../Directives/highlight.directive";
import {MoleculeViewerComponent} from "../Components/molecule-viewer.component";
import {ArrayHelper} from "../Helpers/array-helper";
import {GeneEditorComponent} from "../Components/gene-editor.component";
import {GeneSubmittedComponent} from "../Components/gene-submitted.component";
import {OptionSelectedDirective} from "../Directives/option-selected.directive";
import {GeneMutationComponent} from "../Components/gene-mutation.component";
import {SiteMutationComponent} from "../Components/site-mutation.component";


const componentDeclarations = [AppComponent, GeneListComponent, GeneComponent, GeneSelectorComponent,
    MoleculeViewerComponent, GeneEditorComponent, GeneSubmittedComponent, GeneMutationComponent, SiteMutationComponent];
const directiveDeclarations:Array<Type<any> | any[]> = [HighlightDirective, OptionSelectedDirective];
const pipeDeclarations:Array<Type<any> | any[]> = [];

const routes: Routes = [
    //{ path: '', component: AppComponent},
    <Route>{path: 'gene/:geneName/edit', component: GeneEditorComponent},
    //{path:'wwwroot/dist/web', redirectTo:'/'},       //redirectTo: '/about', pathMatch:'full'

    // {path: '**', component: NotFoundComponent}   //TODO: need to implement
    //{ path: '**', redirectTo: '/'}
];

@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes), HttpModule],
    declarations: [componentDeclarations, directiveDeclarations, pipeDeclarations],
    bootstrap: [AppComponent],
    providers: [
        {provide: AppState, useValue: new AppState()},    //useValue - because AppState should be only one local state and we shouldn't create instance of local state each time
        {provide: GeneList, useClass: GeneList},    //GeneList //both form of use are equivalent
        LogService, ArrayHelper,
        {provide: config.APP_CONFIG_TOKEN, useValue: config.EVOLUTION_CONFIG},      //https://angular.io/guide/dependency-injection#the-provider-class-and-provide-object-literal
        {provide: SITE_ENUMS_TOKEN, useValue:  SiteEnum},
        //{provide: GENE_ENUM_TOKEN, useValue: GeneEnum}
        {provide: URL, useValue:'http://localhost:9001'}
    ]//,
    //schemas: [NO_ERRORS_SCHEMA]       //this is needed if you wanna use not Angular/HTML(e.g. <pdb>) tag into HTML templates of your components
})
export class EvolutionModule {
    constructor(public appRef: ApplicationRef, public appStore: AppState) {}
    hmrOnInit(store: any) {
        console.log('hmrOnInit generated');
        if (!store || !store.state) { return; }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // restore state
        this.appStore.state = store.state;
        // restore input values
        if ('restoreInputValues' in store) { store.restoreInputValues(); }
        this.appRef.tick();
        Object.keys(store).forEach(prop => delete store[prop]);
    }
    hmrOnDestroy(store: any) {
        console.log('hmrOnDestroy generated');
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        store.state = this.appStore.state;
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues  = createInputTransfer();
        // remove styles
        removeNgStyles();
    }
    hmrAfterDestroy(store: any) {
        console.log('hmrAfterDestroy generated');
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}