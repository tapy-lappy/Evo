import {IEvent, IInteractEvent} from "./event-interaction.service";
import {Observable} from "rxjs/Observable";

//Abstract base token classes for 2 possible kinds of event:
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


//Abstract token classes to register event SINGLETON instance with token:
abstract class RemoveGeneInteractionMultiCastEventToken<T> extends BaseEventToken<T>{}

abstract class SiteInteractionToken<TInput,TOutput> extends BaseInteractionToken<TInput, TOutput>{}
abstract class GeneInteractionToken<TInput,TOutput> extends BaseInteractionToken<TInput,TOutput>{}



export {SiteInteractionToken, GeneInteractionToken, RemoveGeneInteractionMultiCastEventToken}