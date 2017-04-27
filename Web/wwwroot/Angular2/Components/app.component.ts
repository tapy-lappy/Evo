import { Component, OnInit } from '@angular/core';

import { WebApiService } from '../Services/web.api.service';
import { Test } from '../Dto/test';
import { Currency } from '../Models/currency';
import { CurrencyFormatPipe } from '../Pipes/currency.format.pipe';

//import {Observable} from 'rxjs/Observable';
////import 'rxjs/add/operator/map';
////import 'rxjs/add/operator/catch';
////import 'rxjs/add/operator/do';
//import 'rxjs/add/observable/of';

@Component({
    selector: 'travel-organizer-app',
    template: `
<h2 [hidden]="hideError" class="alert alert-danger">Error: {{error}}</h2>
<h3 *ngIf="error" class="alert alert-danger">Error2: {{error}}</h3>

<h1>Welcome, {{input}}!</h1>
<label>Enter the name:</label>
<input [(ngModel)]="input" placeholder="Name">
<div *ngIf="showData">
    <div>Got from server: </div>
    <div>Label {{data?.label}}</div>
    <div>Y: {{data?.x}}</div>
    <div>X: {{data?.y}}</div>
</div>
<select *ngIf="currencies">
    <option *ngFor="let currency of currencies; let i = index" (click)="showCurrency(i + 1, currency)">
        {{currency | currencyFormat:i + 1}}
    </option>
</select>`,
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
}