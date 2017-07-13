import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {SiteEnum} from "../Enums/site-enum";
import {Molecule} from "../../Libraries/Molvwr/molecule";
import Gene from "../Models/gene";

@Injectable()
export class SiteInteractionService {
    private siteClickedSources = new Subject<SiteEnum|Gene>();
    siteClicked$ = this.siteClickedSources.asObservable();
    siteClick(molecule: SiteEnum|Gene){
        this.siteClickedSources.next(molecule);
    }

    private moleculaDisplaySources = new Subject<Molecule>();
    moleculaDisplayed$ = this.moleculaDisplaySources.asObservable();
    moleculaDisplay(molecule: Molecule){
        this.moleculaDisplaySources.next(molecule);
    }
}
