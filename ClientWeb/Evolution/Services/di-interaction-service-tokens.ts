import {IEvent, IInteractEvent} from "./event-interaction.service";
import {Observable} from "rxjs/Observable";

abstract class SiteInteractionToken<T1,T2> implements IInteractEvent<T1, T2>{
    confirmed$: Observable<T2>;
    confirm(value: T2): void {
        throw new Error('Method not implemented.');
    }

    generated$: Observable<T1>;
    event(value: T1): void {
        throw new Error('Method not implemented.');
    }
}
abstract class GeneInteractionToken<T1,T2> implements IInteractEvent<T1, T2>{
    confirmed$: Observable<T2>;
    confirm(value: T2): void {
        throw new Error('Method not implemented.');
    }

    generated$: Observable<T1>;
    event(value: T1): void {
        throw new Error('Method not implemented.');
    }
}
abstract class RemoveGeneInteractionMultiCastEventToken<T> implements IEvent<T>{
    generated$: Observable<T>;
    event(value: T): void {
        throw new Error('Method not implemented.');
    }
}

export {SiteInteractionToken, GeneInteractionToken, RemoveGeneInteractionMultiCastEventToken}