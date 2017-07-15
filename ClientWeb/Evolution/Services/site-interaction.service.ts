import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {SiteEnum} from "../Enums/site-enum";
import {Molecule} from "../../Libraries/Molvwr/molecule";
import Gene from "../Models/gene";

@Injectable()
export class SiteInteractionService<T> {
    private siteClickedSources = new Subject<T>();
    siteClicked$ = this.siteClickedSources.asObservable();
    siteClick(molecule: T){
        this.siteClickedSources.next(molecule);
    }

    private moleculaDisplaySources = new Subject<T>();
    moleculaDisplayed$ = this.moleculaDisplaySources.asObservable();
    moleculaDisplay(molecule: T){
        this.moleculaDisplaySources.next(molecule);
    }
}
