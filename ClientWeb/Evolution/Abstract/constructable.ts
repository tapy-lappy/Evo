//https://stackoverflow.com/a/37655100
//https://stackoverflow.com/a/13408029
//Construct signatures in interfaces are not implementable in classes; they're only for defining existing JS APIs that define a 'new'-able function.

export interface Constructable<T>{
    new/*<T>*/(...args:any[]): T;
}