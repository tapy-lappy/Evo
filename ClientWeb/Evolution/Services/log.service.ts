import {Injectable} from "@angular/core";

@Injectable()
export default class LogService{
    logs: Array<string> = [];

    protected prepareMessage(message: string, title?: string){
        title = title ? title : 'LOG';
        let msg = `${title}: ${message}`;
        this.logs.push(msg);
        return msg;
    }

    log(message: string): void{
        console.log(this.prepareMessage(message));
    }
    warn(message: string){
        console.warn(this.prepareMessage(message, 'WARN'));
    }
    err(message: string){
        console.error(this.prepareMessage(message, 'ERR'));
    }
}
