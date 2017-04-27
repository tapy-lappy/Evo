import { InjectionToken } from '@angular/core';

interface AppConfig{
    apiEndpoint: string;
    title: string;
}

const EVOLUTION_CONFIG: AppConfig = {
    apiEndpoint: 'http://localhost:56120/api/skyscanner/Travel/GetService',
    title: 'Evolution'
};

//Using token because SIMPLE VALUE TYPES(date, number, string) or SHAPELESS OBJECTS(arrays, functions) don't have application interfaces and therefore aren't well represented by a class.
//Also there are note about interfaces(which used here - interface AppConfig):
//https://angular.io/docs/ts/latest/cookbook/dependency-injection.html#!#tokens - You can't use an interface as a provider token because interfaces are not JavaScript objects.
//They exist only in the TypeScript design space. They disappear after the code is transpiled to JavaScript.
//A provider token must be a real JavaScript object of some kind: such as a function, an object, a string, or a class.
const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>("app-config");

export { APP_CONFIG_TOKEN, EVOLUTION_CONFIG, AppConfig }