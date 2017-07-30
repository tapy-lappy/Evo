export default class ObjectHelper{
    //TODO: using everywhere where we have mixins as this is the simpliest implementation, e.g.: DictionaryArray etc.
    static mixin<T, U>(target: T, source: U): T & U {     //mixin(intersection of types T & U)
        return Object.assign(target, source);
    }

    static deepCopy<T>(source:T):T{
        return Object.assign({}, source);
    }

    static deepCopyArray<T>(source: T[]): T[]{
        return source.map(item => this.deepCopy(item));
    }
}