import { Component, OnInit } from '@angular/core';

import { WebApiService } from '../Services/web.api.service';
import { Test } from '../Dto/test';
import { Currency } from '../Models/currency';
import { CurrencyFormatPipe } from '../Pipes/currency.format.pipe';





import { alertTest as consoleLogger } from './alert';       //import specific item from module and using pseudonim to it
consoleLogger();

const { alertTest } = require('./alert');  //import specific item from module(with const it's impossible to use pseudonim)
alertTest();

import test = require("./alert");       //pseudonim OR alias(import whole module to pseudo entity)
import * as test2 from './alert';       //the same: We are using test2 as namespace pattern
//let test = require("./alert");
//const test = require("./alert");
test.alertTest();
test.Wow();
new test.AlertClass().Alert();

import * as Alert from './alert';       //import whole module to Alert pseudo entity
Alert.alertTest();
Alert.Wow();
new Alert.AlertClass().Alert();

import AlertClass  from './alert'             //import only DEFAULT class AlertClass(not using { ... })
new AlertClass().Alert();

//import AlertClass, {CONST}  from './alert';   //import DEFAULT class AlertClass and not default CONST together

//import {Observable} from 'rxjs/Observable';
////import 'rxjs/add/operator/map';
////import 'rxjs/add/operator/catch';
////import 'rxjs/add/operator/do';
//import 'rxjs/add/observable/of';

@Component({
    selector: 'travel-organizer-app',
    //http://stackoverflow.com/a/38788415
    styles: [String(require('../../wwwroot/css/app.component.css'))],
    //styleUrls:['../../wwwroot/css/app.component.css'],              //doesn't work
    //template: require('../../wwwroot/html/app.component.html'),     //works
    templateUrl: '../../wwwroot/html/app.component.html',
    providers: [WebApiService]
})
export class AppComponent {
    input = '';
    private data: Test;
    //private currencies: Observable<Currency[]>;     //async pipe
    private currencies: Currency[];
    private showData: boolean;
    private hideError: boolean = true;
    private error: any;
    private test: string;

    constructor(private webApi: WebApiService) { }

    ngOnInit() {
        //this.webApi.post(new Test('test', 12, 13)).subscribe((test: Test) => {
        //    this.data = test;
        //    this.showData = true;
        //});
        //this.webApi.postService('currencies').subscribe(completed => { alert('Completed'); });

        //===============Async pipe===============
        this.webApi.getService<Array<Currency>>('currencies').subscribe(
            currencies =>
            {
                //this.currencies = Observable.of(currencies);        //async pipe: need to transform Currency[] to Observable<Currency[]>
                this.currencies = currencies;
            },
            error => this.processingError(error),
            () => console.log('Downloading completed')
        );
    }

    showCurrency(index: number, currency: Currency) : void
    {
        this.input = new CurrencyFormatPipe().transform(currency, index);
    }

    processingError(error: any): void
    {
        this.error = error;
        this.hideError = false;
        console.log(error);
    }

    Test(): void
    {
        let k = 33;
        console.log(k);
        test.alertTest();

        console.warn(ENV);
        console.warn(ENV);
        console.log(PORT);
        console.trace(process.env.ENV);
        console.debug(process.env.PORT);
        console.error(METADATA.ENV);
    }

    //ChangeOption(selectedOption: HTMLOptionElement): void
    //{
    //    //this.showCurrency(selectedOption.value, )

    //    //(change)="ChangeOption(this.options[this.selectedIndex])
    //    // value={{currency | currencyFormat:i + 1}}
    //    this.input = selectedOption.value;
    //}
}
