import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './Modules/app.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);

// import 'angular2-universal-polyfills/browser';
// import { platformUniversalDynamic } from 'angular2-universal';

//Boot the application, either now or when the DOM content is loaded
//const platform = platformUniversalDynamic();
const bootApplication = () => { platform.bootstrapModule(AppModule); };
if (document.readyState === 'complete')
{
    bootApplication();
} else
{
    document.addEventListener('DOMContentLoaded', bootApplication);
}