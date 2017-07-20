import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {SiteEnum} from "../Enums/site-enum";
import {Molecule} from "../../Libraries/Molvwr/molecule";
import Gene from "../Models/gene";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {Subscriber} from "rxjs/Subscriber";
import {Observer} from "rxjs/Observer";

// @Injectable()
// export default class SiteInteractionService<T> {
//     private siteClickedSources = new Subject<T>();
//     siteClicked$ = this.siteClickedSources.asObservable();
//     siteClick(molecule: T){
//         this.siteClickedSources.next(molecule);
//     }
//
//     private moleculaDisplaySources = new Subject<T>();
//     moleculaDisplayed$:Observable<T> = this.moleculaDisplaySources.asObservable();
//     moleculaDisplay(molecule: T){
//         this.moleculaDisplaySources.next(molecule);
//
//         //return Observable.of(molecule);
//
//         // return Observable.create((observer:Subscriber<T>) => {
//         //     observer.next(molecule);
//         //     observer.complete();
//         // });
//     }
// }

interface IEvent<T>{
    generated$: Observable<T>;
    event(value:T):void;
}
interface IInteractEvent<TInput, TOutput> extends IEvent<TInput>{
    confirmed$: Observable<TOutput>;
    confirm(value:TOutput):void;
}
@Injectable()
class SingleEvent<T> implements IEvent<T>{
    generated$:Observable<T>;
    constructor(private observer:Observer<T>/*private subscriber:Subscriber<T>*/){    //class Subscriber<T> extends Subscription implements Observer<T>
    }
    event(value: T): void {
        //Create Observable from data:
        // this.observable$ = Observable.create((observer:Subscriber<T>)=>{     //https://stackoverflow.com/a/34663310
        //     observer.next(value);
        //     observer.complete();
        // });
        //Converts arguments to an observable sequence.      http://xgrommx.github.io/rx-book/content/observable/observable_methods/of.html
        this.generated$ = Observable.of(value);        //https://stackoverflow.com/a/40004889
        this.observer.next(value);
        //this.observable$.subscribe(this.subscriber);  //TODO: this must be done in component because we need to unsubscribe also!!!
    }
}
@Injectable()
class MultiCastEvent<T> implements IEvent<T>{     //multicast event
    private source = new Subject<T>();
    generated$:Observable<T> = this.source.asObservable();
    event(value: T){
        this.source.next(value);
    }
}
@Injectable()
class InteractEvent<TInput, TOutput> extends MultiCastEvent<TInput> implements IInteractEvent<TInput, TOutput>{
    private confirmSource = new Subject<TOutput>();
    confirmed$ = this.confirmSource.asObservable();
    confirm(successed: TOutput){this.confirmSource.next(successed);}
}
export {MultiCastEvent, InteractEvent, IEvent, IInteractEvent};