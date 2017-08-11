import {ReactFormBuilder} from "../Abstract/react-form-builder";
import {FormArray, FormControl, FormGroup, FormBuilder} from "@angular/forms";
import {Provider} from "@angular/core";
import DI from "../Helpers/di-helper";
import {Resolvable} from "../Abstract/resolvable";

export default class ReactFormBuilderFactory<T>{
    /*Note: have to use constrain T extends ReactFormBuilder to guarantee there are build<T>() method inside component
    * Note: we are building, so component can create its form model by itself. Use constrain T extends Resolvable to
    * Note: make sure we still can create component even if it has some dependencies into its constructor(additional
    * Note: optional param 'providers' allow us to send that dependency' data to component by creating it with a
    * Note DI helper). Creating component this way: CODE: new componentInstance()` is unacceptable, because we are
    * Note: using generic approach and do not know what params component require, so we have to send providers to
    * Note: our factory methods.*/

    /*Note: one more note - we do all factory's methods static to avoid neccessarity to send factory as param to each
    * Note: of nested child components and reduce cases when we really need to send CODE: ...providers: Provider[] to
    * Note: create component with it's dependencies. Otherwise we need to insert our ReactFormBuilderFactory<T> into
    * Note: constructor of each nested react component. And it would be much complicated and sophisticated to read
    * Note: code.*/

    //https://www.typescriptlang.org/docs/handbook/generics.html
    //When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions.
    //Here we say our instance of type T must have constructor: 'instance: { new(fb: FormBuilder, ...providers:Provider[]): T; }'
    //with FormBuilder param and optionally - array of Provider in case component instance will depend on some services in
    //its constructor:

    static component<T extends ReactFormBuilder & Resolvable>(
        componentInstance: { new(fb: FormBuilder): T;},
        ...providers: Provider[]):
            ReactFormBuilder    //it's not T here to restrict all the members of componentInstance only by members of ReactFormBuilder
    {
        //return new componentInstance();
        return DI.resolve<T>(componentInstance, [{provide:componentInstance, useClass:componentInstance}, providers]);
    }

    static builder<T extends ReactFormBuilder & Resolvable>(
        //componentInstance: { new(fb: FormBuilder, ...providers:Provider[]): T;},
        componentCtor: { new(fb: FormBuilder): T;},
        //componentInstance: T,
        //componentInstance: { new(): T;},
        ...providers: Provider[]):
    <T>(initializationData?: any) => FormGroup | FormArray | FormControl    //signature of ReactFormBuilder.build member
    {
        //return new componentInstance().build;
        const component: T = (DI.resolve(componentCtor,
            /*Explanation: this provider needed because we need to register our requested type(componentInstance) into injector,
            * see following sample:
            * https://angular.io/api/core/ReflectiveInjector#example-live-demo-3
            * for GeneService/MutationService we also register it, but in a bit different way: we have geneServiceProvider/mutationServiceProvider
            * which we send into DI.resolve()  */
            {provide:componentCtor, useClass:componentCtor},
            providers) as T);
        return component
            .build               //method of ReactFormBuilder which must build form model for reactive component
            .bind(component);    //Explanation: bind 'build' fuction context to component instance(without this keyword 'this' will be undefined inside 'build' function when 'build' will be executed)
    }
}