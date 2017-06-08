import {Injectable} from "@angular/core";
import {ArrayHelper} from "../Helpers/array-helper";
//const ArrayHelper = require('../Helpers/array-helper');

@Injectable()
export default class LogService{
    logs: Array<string> = [];

    constructor(private arrayHelper: ArrayHelper<string>){}

    protected prepareMessage(message: string, title?: string){
        title = title ? title : 'LOG';
        let msg = `${title}: ${message}`;
        this.logs.push(msg);
        return msg;
    }

    log(message: string): void;
    log(data: {template: string; styles?: string|Array<string>; content?: string}): void;
    log(data: string | any){
        if (typeof data == 'string') console.log(this.prepareMessage(data));
        else if (typeof data == 'object'){
            this.logFormattedData(data, console.log);
        }
    }

    logFormattedData(data: {template: string; styles?: string|Array<string>; content?: string},
            handler: (message: string, ...optionalParams: string[]) => void, title?: string) {
        let optionalParams: string[] = [];
        if(data.styles) {
            data.template = '%c'.concat(data.template);
            let stylesCombined = (typeof data.styles == 'string') ? data.styles : data.styles.join(';');
            this.arrayHelper.addTo(stylesCombined, optionalParams);
        }
        if(data.content) {
            data.template += ' %s';
            this.arrayHelper.addTo(data.content, optionalParams);
        }
        handler(this.prepareMessage(data.template, title), ...optionalParams);
    }
    
    warn(message: string){
        console.warn(this.prepareMessage(message, 'WARN'));
    }
    err(message: string){
        console.error(this.prepareMessage(message, 'ERR'));
    }
}
