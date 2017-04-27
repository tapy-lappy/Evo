//import {Component} from "@angular/core";
function alertTest(){
    console.log('>>>-----Test');
}

function alertWow() {
    console.log('---WOW---');
}

export default class AlertClass{
    Alert(){
        console.log('*****************');
    }
}

export const CONST: number = 123;

// if we will import whole this module to have access to AlertClass through the
// pseudonim we must include it to export {...} definition too, inspite of the fact
// it has alredy defined like 'export default'. But that default doesn't mean it
// will automatically be included to whole module export!
export { alertTest, alertWow as Wow, AlertClass }
