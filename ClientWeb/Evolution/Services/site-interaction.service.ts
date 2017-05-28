import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {SiteEnum} from "../Enums/site-enum";
import {DnaEnum} from "../Enums/dna-enum";
import {Molecule} from "../../Libraries/Molvwr/molecule";

@Injectable()
export class SiteInteractionService {
    private siteHoveredSources = new Subject<SiteEnum|DnaEnum>();
    siteHovered$ = this.siteHoveredSources.asObservable();
    siteHover(molecule: SiteEnum|DnaEnum){
        this.siteHoveredSources.next(molecule);
    }

    private moleculaDisplaySources = new Subject<Molecule>();
    moleculaDisplayed$ = this.moleculaDisplaySources.asObservable();
    moleculaDisplay(molecule: Molecule){
        this.moleculaDisplaySources.next(molecule);
    }
}
