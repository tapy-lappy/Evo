import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import Gene from "../Models/gene";
import {Observable} from "rxjs/Observable";

@Injectable()
export default class GeneInteractionService<T> {
    private geneRemovedSources = new Subject<T>();
    geneRemoved$ = this.geneRemovedSources.asObservable();
    remove(item: T){
        this.geneRemovedSources.next(item);
    }

    private geneAddedSources = new Subject<T>();
    geneAdded$ = this.geneAddedSources.asObservable();
    add(item: T){
        this.geneAddedSources.next(item);
    }
    private confirmSource = new Subject<boolean>();
    confirmed$ = this.confirmSource.asObservable();
    confirmed(successed: boolean){this.confirmSource.next(successed);}
}