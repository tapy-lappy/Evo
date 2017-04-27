import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from '../Components/app.component';
import { CurrencyFormatPipe } from '../Pipes/currency.format.pipe';
////import package from 'package' pattern:
////import mongoose from 'mongoose' // or
////import mongoose = require('mongoose')

import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { ApplicationRef } from '@angular/core';
import { AppStore } from '../AppStores/app.store';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule],
    declarations: [AppComponent, CurrencyFormatPipe],
    bootstrap: [AppComponent],
    providers: [ AppStore ]
})
export class AppModule {
    constructor(public appRef: ApplicationRef, public appStore: AppStore) {}
    hmrOnInit(store: any) {
        console.log('hmrOnInit generated');
        if (!store || !store.state) { return; }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // restore state
        this.appStore.setState(store.state);
        // restore input values
        if ('restoreInputValues' in store) { store.restoreInputValues(); }
        this.appRef.tick();
        Object.keys(store).forEach(prop => delete store[prop]);
    }
    hmrOnDestroy(store: any) {
        console.log('hmrOnDestroy generated');
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        const currentState = this.appStore.getState();
        store.state = currentState;
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