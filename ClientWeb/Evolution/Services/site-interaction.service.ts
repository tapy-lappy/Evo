import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {SiteEnum} from "../Enums/site-enum";
import {GeneEnum} from "../Enums/gene-enum";
import {Molecule} from "../../Libraries/Molvwr/molecule";

@Injectable()
export class SiteInteractionService {
    private siteClickedSources = new Subject<SiteEnum|GeneEnum>();
    siteClicked$ = this.siteClickedSources.asObservable();
    siteClick(molecule: SiteEnum|GeneEnum){
        this.siteClickedSources.next(molecule);
    }

    private moleculaDisplaySources = new Subject<Molecule>();
    moleculaDisplayed$ = this.moleculaDisplaySources.asObservable();
    moleculaDisplay(molecule: Molecule){
        this.moleculaDisplaySources.next(molecule);
    }
}
