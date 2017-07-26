import {Injectable, Provider, ReflectiveInjector} from '@angular/core';
import {Resolvable} from "../Abstract/resolvable";

@Injectable()
export default class DI {
    //type: Resolvable - for interfaces, type: typeof MutationService - for clases(TODO: is 'typeof MutationService' paramenter type guard???)
    static resolve<T extends Resolvable>(type: Resolvable, ...providers: Provider[]): T{
        let resolvedProviders = ReflectiveInjector.resolve(providers);
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
        //console.log(`Impossible to extract ${type.toString()}`);          //log ALL THE code of class
        return injector.get(type, `ERROR: DI --> Impossible to extract ${type.toString()}`);
        //return injector.get(type);
    }
}