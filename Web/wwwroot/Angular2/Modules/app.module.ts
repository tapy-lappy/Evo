import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from '../Components/app.component';
import { CurrencyFormatPipe } from '../Pipes/currency.format.pipe';
////import package from 'package' pattern:
////import mongoose from 'mongoose' // or
////import mongoose = require('mongoose')

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule],
    declarations: [AppComponent, CurrencyFormatPipe],
    bootstrap: [AppComponent] 
})
export class AppModule { }