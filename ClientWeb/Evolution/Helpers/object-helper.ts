export default class ObjectHelper{      //it's not ObjectHelper<T> because static members can not use the class’s type parameter
    //TODO: using everywhere where we have mixins as this is the simpliest implementation of mixin, e.g.: DictionaryArray etc.
    //Workaround: commented, because overload doesn't work with generic types. It works properly with non-generic types
    //Workaround: but it sees only first version of overload for generics and doesn't see others.
    // static mixin<T, U>(target: T, source: U): T & U;
    // static mixin<T, U, V>(target: T, source1: U, source2: V): T & U & V;
    // static mixin<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;

    // static mixin<T>(target: T, ...sources: any[]) : any{
    //     //Error: This version of Object.assign works incorrectly. Because it doesn't know correct types of ...sources:any[] it doesn't copy
    //     //Error: properties of ...sources to target. Instead of it copies all the items(from ...sources) as a property into target. So, in
    //     //Error: the result target all item from ...sources array is property.
    //     return Object.assign(target, sources);
    // }
    static mixin<T, U, V, W>(target: T, source1: U, source2?: V, source3?: W): T & U & V & W{

        return Object.assign(target, source1, source2, source3);
    }


    static copy<T>(source: T | Array<T>) : T | Array<T>{
        if (source instanceof Array)
            return source.map(item => this.copy(item)) as Array<T>; //here we use recursive call which returns LIGHT COPY of each array instance
        //Explanation: this will not create NEW item. If item contains internal array of other items - it copies the same areas of memory, so it will be
        //Explanation: the same array. Also in case of complex item - when item has property which really is nested instance of other class, it will also
        //Explanation: copy the same instance(as a block of memory). It means there is possibility to change array properties & nested properties after copy was created.
        //Outcome: So, it's good choice to create LIGHT COPY, but can't be used for creating DEEP COPY.
        return Object.assign({}, source);
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
    //TODO: should be used in DictionaryArray as a change for CODE: Object.keys(instance1).forEach(p => (<any>result)[p] = (<any>instance1)[p]);
    //TODO: because for now there are no DEEP COPY for properties which are: array OR instance of class itself.
    //Workaround: commented, because overload doesn't work with generic types. It works properly with non-generic types
    //Workaround: but it sees only first version of overload for generics. So, second version(with array) is invisible from code.
    //deepCopy<T>(source: T) : T;
    //deepCopy<T>(source: T[]) : T[];
    static deepCopy<T>(source: T | T[]) : T | T[]{
        if (source instanceof Array){
            return source.map(item => this.deepCopy(item)) as Array<T>;
        }
        else{
            let deepCopyItem = <T>{};
            //copy item property by property:
            Object.keys(source).forEach(prop => {       //alternative: for(let prop in source)
                const currentProperty = (<any>source)[prop];
                if (currentProperty instanceof Array)
                    (<any>deepCopyItem)[prop] = this.deepCopy(currentProperty);     //recursive call to deep copy of item
                else if(currentProperty instanceof Object)      //if property value it's nested class(Object)
                    (<any>deepCopyItem)[prop] = this.deepCopy(currentProperty);
                else
                    //(<any>deepCopyItem)[prop] = currentProperty;                                  //set up property's value
                    deepCopyItem = this.mixin(deepCopyItem, {[prop]: currentProperty});     //alternative way to set up property's value - mixin
            });
            return deepCopyItem;
        }
    }
}