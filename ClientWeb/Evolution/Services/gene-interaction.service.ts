import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {GeneEnum} from "../Enums/gene-enum";

@Injectable()
export default class GeneInteractionService {
    private geneRemovedSources = new Subject<GeneEnum>();
    geneRemoved$ = this.geneRemovedSources.asObservable();
    remove(geneItem: GeneEnum){
        this.geneRemovedSources.next(geneItem);
    }
}