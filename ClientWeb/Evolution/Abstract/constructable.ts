//https://stackoverflow.com/a/37655100
//https://stackoverflow.com/a/13408029
//Construct signatures in interfaces are not implementable in classes; they're only for defining existing JS APIs that define a 'new'-able function.
/*Explanation: it's like a restriction/constrain/type guard - what kind of instances method may work with
* In our case - with all kind of instances which have constructor(with or withour params).*/

export interface Constructable<T>{
    new/*<T>*/(...args:any[]): T;
}