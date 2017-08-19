import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {SiteEnum} from "../Enums/site-enum";
import {Molecula} from "../../Libraries/Molvwr/molecule";
import Gene from "../Models/gene";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {Subscriber} from "rxjs/Subscriber";
import {Observer} from "rxjs/Observer";
import {IArray, IDictionary, Indexable} from "../Abstract/interfaces";
import {Subscription} from "rxjs/Subscription";

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


//https://embed.plnkr.co/?show=preview
// @Injectable()
// export class HeroService {
//
//     delayMs = 500;
//
//     // Fake server get; assume nothing can go wrong
//     getHeroes(): Observable<Hero[]> {
//         return of(heroes).delay(this.delayMs); // simulate latency with delay    - it creates Observable
//     }
//
//     // Fake server update; assume nothing can go wrong
//     updateHero(hero: Hero): Observable<Hero>  {
//         const oldHero = heroes.find(h => h.id === hero.id);
//         const newHero = Object.assign(oldHero, hero); // Demo: mutate cached hero
//         return of(newHero).delay(this.delayMs); // simulate latency with delay
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

interface IOneToManyInteractEvent<TInput, TOutput extends Indexable> extends IEvent<TInput>{
    subscribe(callback: (value: TOutput) => void):number;
    unsubscribe(subscriptionIndex:number):void;
    confirm(value:TOutput):void;
}

//TODO: We do not use this:
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

@Injectable()
class OneToManyInteractEvent<TInput, TOutput extends Indexable> extends MultiCastEvent<TInput> implements IOneToManyInteractEvent<TInput, TOutput> {
    private observers: IArray<MultiCastEvent<TOutput>> = [];
    private subscriptions: IArray<Subscription> = [];

    index = 0;
    subscribe(callback: (value: TOutput) => void):number{
        this.observers[this.index] = new MultiCastEvent();
        this.subscriptions[this.index] = this.observers[this.index].generated$.subscribe(callback);
        return this.index++;
    }
    unsubscribe(subscriptionIndex:number){
        delete this.observers[subscriptionIndex];
        this.subscriptions[subscriptionIndex].unsubscribe();
        delete this.subscriptions[subscriptionIndex];
    }

    confirm(value: TOutput): void {
        this.observers[value.index].event(value);       //index from Indexable
    }

}

export {OneToManyInteractEvent, MultiCastEvent, InteractEvent,
    IOneToManyInteractEvent, IInteractEvent, IEvent};