import {IEvent, IInteractEvent, IOneToManyInteractEvent} from "./event-interaction.service";
import {Observable} from "rxjs/Observable";
import {Indexable} from "../Abstract/interfaces";

//Abstract base token classes for 2 possible kinds of event:
//Class used as a "narrowing" interface that exposes properties of real instance of service(which is hidden under the token) and the same time it
//may hide properties which must be hidden. So, it's really narrowing: https://angular.io/guide/dependency-injection-in-action#class-interface
//But here we use this "narrowing" interface classes also as base classes in token hierarchy(basically to reduce duplication of code which would
//be caused by implementation real interfaces: IEvent<T>, IInteractEvent<T1,T2> in each token class).
//When you use a class this way, it's called a class-interface. The key benefit of a class-interface is that you can get the strong-typing of an
//interface and you can use it as a provider token in the way you would a normal class.
abstract class BaseEventToken<T> implements IEvent<T>{
    generated$: Observable<T>;
    event(value: T): void {
        throw new Error('Method not implemented.');
    }
}
abstract class BaseInteractionToken<T1,T2> extends BaseEventToken<T1> implements IInteractEvent<T1,T2>{
    confirmed$: Observable<T2>;
    confirm(value: T2): void {
        throw new Error('Method not implemented.');
    }
}
abstract class BaseOneToManyInteractionToken<T1, T2 extends Indexable> extends BaseEventToken<T1> implements IOneToManyInteractEvent<T1, T2>{
    subscribe(callback: (value: T2) => void):number{
        throw new Error('Method not implemented.');
    }
    unsubscribe(subscriptionIndex:number){
        throw new Error('Method not implemented.');
    }
    confirm(value: T2): void {
        throw new Error('Method not implemented.');
    }
}


//Abstract provider token classes to register SINGLETON event instance with each of them:
abstract class RemoveGeneInteractionMultiCastEventToken<T> extends BaseEventToken<T>{}
//Question: When you IMPLEMENT(not extends) base class: https://angular.io/guide/dependency-injection-in-action#the-parent-class-interface
/*It's also possible to use base class as a class-interface("narrowing" interface) but that leads to neccessarity to implement all the members
* of that base class as it serves as interface. So, to reduce code dublication we do not use that approach(but it's possible):*/
// abstract class RemoveGeneInteractionMultiCastEventToken<T> implements BaseEventToken<T>{
//     generated$: Observable<T>;
//
//     event(value: T): void {
//         throw new Error('Method not implemented.');
//     }
// }
//Remark: The key benefit of an abstract class-interface is that you can get the strong-typing of an interface and you can use it
//Remark: as a provider token in the way you would a normal class(interface can't be used as provider token, because
//Remark: in JS there are no interfaces). https://angular.io/guide/dependency-injection-in-action#class-interface
//Note: You can't use an interface as a provider token because interfaces are not JavaScript objects. They exist only in the TypeScript design space.

abstract class SiteInteractionToken<TInput,TOutput extends Indexable> extends BaseOneToManyInteractionToken<TInput, TOutput>{}
abstract class GeneInteractionToken<TInput,TOutput> extends BaseInteractionToken<TInput,TOutput>{}



export {SiteInteractionToken, GeneInteractionToken, RemoveGeneInteractionMultiCastEventToken}