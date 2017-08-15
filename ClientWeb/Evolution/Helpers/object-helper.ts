import {Constructable} from "../Abstract/constructable";

export default class ObjectHelper {//it's not ObjectHelper<T> because static members can not use the class’s type parameter
    //Outcome: using everywhere where we have mixins as this is the simpliest implementation of mixin, e.g.: DictionaryArray etc.
    //Workaround: commented, because overload doesn't work with generic types. It works properly with non-generic types
    //Workaround: but it sees only first version of overload for generics and doesn't see others.
    // static mixin<T, U>(target: T, source: U): T & U;
    // static mixin<T, U, V>(target: T, source1: U, source2: V): T & U & V;
    // static mixin<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;

    // static mixin<T>(target: T, ...sources: any[]) : any{
    //     //Error: This version of Object.assign works incorrectly. Because it doesn't know correct types of ...sources:any[] it doesn't copy
    //     //Error: properties of ...sources to target. Instead of it copies all the items(from ...sources) as a property into target. So, in
    //     //Error: the result target all item from ...sources array are properties.
    //     return Object.assign(target, sources);
    // }
    static mixin<T, U, V, W>(target: T, source1: U, source2?: V, source3?: W): T & U & V & W {
        // let result = <T & U>{};
        // Object.keys(source1).forEach(p => (<any>result)[p] = (<any>source1)[p]);
        // Object.keys(source2).forEach(p => (result as any)[p] = (source2 as any)[p]);
        // return result;

        return Object.assign(target, source1, source2, source3);
    }


    static copy<T>(source: T | Array<T>): T | Array<T> {
        if (source instanceof Array)
            return source.map(item => this.copy(item)) as Array<T>; //here we use recursive call which returns LIGHT COPY of each array instance
        //Explanation: this will not create NEW item. If item contains internal array of other items - it copies the same areas of memory, so it will be
        //Explanation: the same array. Also in case of complex item - when item has property which really is nested instance of other class, it will also
        //Explanation: copy the same instance(as a block of memory). It means there is possibility to change array properties & nested properties after copy was created.
        //Outcome: So, it's good choice to create LIGHT COPY, but can't be used for creating DEEP COPY.
        return this.mixin({}, source);
    }


    /* Testing:
      let testItem = {
            name: 'test',
            array: [{value: 1}, {value: 2}],
            nestedItem:{
                name: 'nested',
                value: 'value'
            }
        }
        let array = [{value: 1, nested: {name: '+'}}, {value: 2, nested: {name: '+'}}];

        let itemCopy = ObjectHelper.copy(testItem);
        let itemDeepCopy = ObjectHelper.deepCopy(testItem);
        let arrayCopy = ObjectHelper.copy(array);

        console.log(JSON.stringify(itemCopy));
        console.log(JSON.stringify(itemDeepCopy));
        console.log(JSON.stringify(arrayCopy));

        testItem.name = '---';
        testItem.array[0] = {value: 7};
        testItem.array[1].value = 7;
        testItem.array.push({value: 3}, {value: 3});
        testItem.nestedItem.name = '+++';
        testItem.nestedItem.value = 'no value';
        array[0] = {value: -1, nested: {name: '-'}};    //ok, you can't replace item
        array[1].value = 7;                             //ok, you can't change direct(not nested) property of item
        array[1].nested.name = '-';                     //NOT OK, you can change nested props
        array.push({value: 0, nested: {name: '-'}},
            {value: -9, nested: {name: '-'}});          //ok, you can't add new items to array

        console.log(JSON.stringify(itemCopy));
        console.log(JSON.stringify(itemDeepCopy));
        console.log(JSON.stringify(arrayCopy));



        Outputs:
        {"name":"test","array":[{"value":1},{"value":2}],"nestedItem":{"name":"nested","value":"value"}}
        {"name":"test","array":[{"value":1},{"value":2}],"nestedItem":{"name":"nested","value":"value"}}
        [{"value":1,"nested":{"name":"+"}},{"value":2,"nested":{"name":"+"}}]

        {"name":"test","array":[{"value":7},{"value":7},{"value":3},{"value":3}],"nestedItem":{"name":"+++","value":"no value"}}    //WRONG, not deep copy
        {"name":"test","array":[{"value":1},{"value":2}],"nestedItem":{"name":"nested","value":"value"}}                            //OK, deep copy
        [{"value":1,"nested":{"name":"+"}},{"value":2,"nested":{"name":"-"}}]                                                       //WRONG, not deep copy because of nested "name" prop changed
    * */
    //Workaround: commented, because overload doesn't work with generic types. It works properly with non-generic types
    //Workaround: but it sees only first version of overload for generics. So, second version(with array) is invisible from code.
    //deepCopy<T>(source: T) : T;
    //deepCopy<T>(source: T[]) : T[];

    //https://github.com/Microsoft/TypeScript/issues/9358#issuecomment-228500639
    //Note: decorate<typeof Foo>()(Foo);  // Foo constructor
    //Note: decorate<Foo>()(new Foo);  // Foo instance

    //This method based on cration copy-mixin -with cration factory we create instance(by using constructor) and then
    //copy all the properties from source:
    static deepCopy<Ctor extends /*{new(...args:any[]): T;}*/Constructable<T>, T>(ctor: Ctor, source: T): T | T[] {
        if (source instanceof Array)
            return source.map(item => this.deepCopy<typeof item, T>(item.constructor, item)) as Array<T>;
        //create item by using its constructor:
        let deepCopyItem: T = this.factory<T>(ctor);             //new ctor();   //<T>{}; - it's Object, typing is lost here
        //copy item property by property:
        Object.keys(source).forEach(prop => {       //alternative: for(let prop in source)
            const currentProperty = (<any>source)[prop];
            if (currentProperty instanceof Array)
                (<any>deepCopyItem)[prop] = this.deepCopy(<Constructable<any[]>><object>currentProperty, currentProperty);//TODO: this.deepCopy(<T><Object>currentProperty);     //recursive call to deep copy of item
            else if (currentProperty instanceof Object)      //if property value it's nested class(Object)
                (<any>deepCopyItem)[prop] = this.deepCopy(currentProperty.constructor, currentProperty);
            else
                (<any>deepCopyItem)[prop] = currentProperty;                                  //set up property's value
                //Note: this is only for LIGHT COPY(not DEEP COPY), but at this point we have a deal with simple properties
                //Note: which are not nested subclasses neither arrays of object. Both eliminated by prior checks
                //deepCopyItem = this.mixin(deepCopyItem, {[prop]: currentProperty});     //alternative way to set up property's value - mixin
        });
        return deepCopyItem;
    }

    private static factory<T>(ctor: Constructable<T>): T {
        //Constructable<T> says constructor must have params: new<T>(...args:any[]): T; but even if it has, the instance will be created
        //with values by default or undefined(if initialization presents into constructor). And the trick is that after creating instance
        //with this factory method then we do deep copy of all item's properties manually.
        return <T>new ctor();
    }

    /*
    This method in use only for Reactive Form components. The deal is when you create for example FormGroup based on some
    item, you actually create FormGroup with the same structure, but you lose typing. And when it's time to extract data
    from those FormGroup you actually extract anonimous object with the same structure but without typing.

    Remark: even if you have FormArray as a first param you must send not Array, but type of item, because method can't
    Remark: get item's type(Ctor) any other way and Array doesn't provide it.
    Remark: If you cast literal object to array - you will get Array(0) without items, but with properties of literal
    Remark: object which must have been items of array! But with no items in array, it will be empty!

    Also possible to create mixings:
        ObjectHelper.cast<Constructable<T>, any>(<Constructable<T>><any>item1.constructor, item2);
    this code will use item1.constructor(not item instance - all the properties will be got from constructor initialization, not from item1 instance itself)
    to create item1 and then copied all properties from item2 to extend just created item1
    */
    static cast<Ctor extends Constructable<T>, T>(ctor: Ctor, origin: T): T | T[]{ //Note: here ctor can't be send as Array!
         if (origin instanceof Array) {
             //In case ctor is not defined wil try to assert type from array's item, if array is empty - use Object as type of array
             if (!ctor) {
                 ctor = origin.length > 0 ? <Ctor>origin[0].constructor : <Ctor>{};     //<Ctor>{} - using Object type as ctor
                 //ctor = origin.length > 0 ? <Ctor>origin[0].constructor : <Ctor>{}.constructor;     //<Ctor>{}.constructor - using Object constructor function as ctor
             }
             //This needed, because inside deepCopy() array processing we have to process each item of array(and also nested
             //arrays) and for that we use 'typeof item/item.constructor':
             //     this.deepCopy<typeof item, T>(item.constructor, item)
             //and we can't use 'typeof ctor/ctor' instead of that, like:
             //     this.deepCopy<typeof ctor, T>(ctor, item)
             //because for Array processing 'ctor' won't be constructor, it will be Array!!! So, considering Remark(please read),
             //we change that Array to real type of item(constructor) here! And this is why we need this piece of code:
             return origin.map(item => this.cast<typeof ctor, T>(ctor, item)) as T[];
         }
         return this.deepCopy<typeof ctor, T>(ctor, origin);
    }

    //Explanation: it's useless, it doesn't return typing, it's simple type assertion and it does nothing
    // static cast<T>(origin: any): T{
    //     return <T>origin;       //This did not cast to type! This is simple type assertion, it dosn't return typing
    // }

    //https://stackoverflow.com/a/35370453
    static propsToArray<T>(obj: { [index: string]: T; } | { [index: number]: T; }): T[] {
        return Object.keys(obj).map(prop => (<any>obj)[prop]);
    }
    static decomposeToArray<T, K extends keyof T>(origin:T): K[]{
        //https://learn.javascript.ru/array-methods#object-keys-obj
        //Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
        // const stringLiteralObject: any = origin;
        // return Object.keys(origin).map(key => stringLiteralObject[key]);

        //Or the same with type casting inside lambda:
        return Object.keys(origin).map(key => (<any>origin)[key]);
    }

    //Note: these methods works with for/in but won't work with Object.keys(key => ...) because key is 'string' but not 'keyof T':
    static getProperty<T, K extends keyof T>(object: T, propertyName: K): T[K]{
        return object[propertyName];
    }
    static setProperty<T, K extends keyof T>(object: T, propertyName: K, value: any): void{
        object[propertyName] = value;
    }
}