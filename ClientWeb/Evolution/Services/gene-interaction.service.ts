import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import Gene from "../Models/gene";
import {Observable} from "rxjs/Observable";

@Injectable()
export default class GeneInteractionService {
    private geneRemovedSources = new Subject<Gene>();
    geneRemoved$ = this.geneRemovedSources.asObservable();
    remove(geneItem: Gene){
        this.geneRemovedSources.next(geneItem);
    }

    private geneAddedSources = new Subject<Gene>();
    geneAdded$ = this.geneAddedSources.asObservable();
    add(gene: Gene){
        this.geneAddedSources.next(gene);
    }
    private additionSuccessSource = new Subject<boolean>();
    additionSuccessed$ = this.additionSuccessSource.asObservable();
    additionSuccesseed(successed: boolean){this.additionSuccessSource.next(successed);}
}