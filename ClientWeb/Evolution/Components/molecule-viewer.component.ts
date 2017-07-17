/// <reference path="../typings/molecules.d.ts" />

import {Component, OnDestroy, OnInit} from '@angular/core';
import {SiteInteractionService} from "../Services/site-interaction.service";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import {SiteEnum} from "../Enums/site-enum";
import {Kind, Molecule} from "../../Libraries/Molvwr/molecule";
import * as helper from '../../Webpack/helpers/path.helper';
//import * as MoleculeViewer from '../../Libraries/Molvwr/molvwr');



//let Adenine = require( '../Molecules/A.pdb');
import A from '../Molecules/A.pdb';
import C from '../Molecules/C.pdb';
//let Adenine = require("expose-loader?a!../Molecules/A.pdb");
import aTxt from 'raw-loader!../Molecules/A.pdb';
import cTxt from 'raw-loader!../Molecules/G.pdb';



//https://github.com/webpack-contrib/bundle-loader
//let loadG = require("bundle-loader?lazy&name=[name]!../Molecules/G.pdb");     //needed for loading chunks where is 'export', not raw sources - it sends only file name to loadG() function
//let strT = require('includes-loader!../Molecules/T.pdb');       //undefined


//require('../../Libraries/Molvwr/hand');
//require('expose-loader?HANDJS!../../Libraries/Molvwr/hand');

//let BABYLON = require('exports-loader?BABYLON!../../Libraries/Molvwr/babylon');
let BABYLON = require("expose-loader?BABYLON!../../Libraries/Molvwr/babylon");
//let Molvwr = require('../../Libraries/Molvwr/molvwr');
//import * as MoleculeViewer from '../../Libraries/Molvwr/molvwr');

//require("expose-loader?BABYLON!../../Libraries/Molvwr/molvwr");
let MoleculeViewer = require("exports-loader?Molvwr,BabylonContext=Molvwr.BabylonContext!../../Libraries/Molvwr/molvwr");
let $ = require("expose-loader?$!jquery");


/*
NOTE: leading -!(before raw-loader) is prepended to ignore other preLoaders and loaders configured by webpack
 adding ! to a request will disable configured preLoaders
     require("!raw!./script.coffee")
 adding -! to a request will disable configured preLoaders and loaders but not the postLoaders
    require("-!raw!./script.coffee")
 adding !! to a request will disable all loaders(pre, normal and post) specified in the configuration
 require("!!raw!./script.coffee")

 //https://webpack.js.org/configuration/module/#rule-enforce
 All normal loaders can be omitted (overridden) by prefixing ! in the request.
 All normal and pre loaders can be omitted (overridden) by prefixing -! in the request.
 All normal, post and pre loaders can be omitted (overridden) by prefixing !! in the request.
 */
const Adenine = require('-!raw-loader!../Molecules/A.mol');     //import source file as a string
import * as Cytosine from '-!raw-loader!../Molecules/C.mol';
const Guanine  = require('-!raw-loader!../Molecules/G.mol');
import * as Thymine from '-!raw-loader!../Molecules/T.mol';
import Gene from "../Models/gene";
import {Subscription} from "rxjs/Subscription";
const Uracil = require('-!raw-loader!../Molecules/U.mol');

@Component({
    moduleId: module.id,
    selector: 'molecule-viewer',
    templateUrl: '../Html/molecule-viewer.component.html'
})

export class MoleculeViewerComponent extends BaseGeneComponent implements OnInit, OnDestroy {
    private siteClicked$:Subscription;

    constructor(private siteInteraction: SiteInteractionService<SiteEnum|Gene|Molecule>) {
        super();
    }

    ngOnInit() {
        this.siteClicked$ = this.siteInteraction.siteClicked$.subscribe(
            molecule => this.displayMolecule(<SiteEnum|Gene>molecule),
            err => this.error(err)
        );

        // The chunk is not requested(with option 'lazy') until you call the load function:
        // loadG(function(file: string) {
        //     // use file like it was required with
        //     // var file = require("./file.js");
        //     console.log(`Molecule PDB file: ${file} has been downloaded.`);
        // });
    }
    ngOnDestroy(): void {
        this.siteClicked$.unsubscribe();
    }

    private displayMolecule(molecule: SiteEnum | Gene) {
        const moleculeData = this.getMoleculeData(molecule);
        let el = $("#moleculeViewer").get(0);
        $(el).attr('data-molvwr', moleculeData.url);
        $(el).attr('data-molvwr-format', moleculeData.format);
        MoleculeViewer.BABYLON = BABYLON;
        MoleculeViewer.Molvwr.process(el,
            (molecule:Molecule) => {
                if(molecule.formula)
                    molecule.formula = molecule.formula.replace(/ /g, '');  //https://stackoverflow.com/a/2116614
                if(molecule.kinds)
                {
                    for(let kindName in molecule.kinds){
                        let kind = molecule.kinds[kindName].kind;
                        let color = new BABYLON.Color3(kind.color[0], kind.color[1], kind.color[2]).scale(255);
                        let R = Math.ceil(color.r);
                        let G = Math.ceil(color.g);
                        let B = Math.ceil(color.b);
                        //extend molecule.kinds[].kind element with new rgb property:
                        (kind as Kind).rgb = `rgb(${R}, ${G}, ${B})`;    //color.toHexString();
                        let invertedColors: number[] = this.invertRGB(R, G, B);
                        (kind as Kind).invertedRGB = `rgb(${invertedColors[0]}, ${invertedColors[1]}, ${invertedColors[2]})`;
                    }
                }
                this.siteInteraction.moleculaDisplay(molecule);
            });
    }

    //https://stackoverflow.com/a/15291738
    private invertRGB(...rgb: number[]) {
        rgb = Array.prototype.join.call(arguments).match(/(-?[0-9\.]+)/g);
        for (var i = 0; i < rgb.length; i++) {
            rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
        }
        return rgb;
    }

    private getMoleculeData(molecule: SiteEnum|Gene){
        // const arginine = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/aminoacids/arginine.txt';
        // const dna = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/dna.txt';
        // const diamond = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/diamond.txt';

        // for (let dna in GeneEnum) {
        //     dna.
        // }

        //if(typeof molecule == "GeneEnum")
        let url, format: string;
        if (molecule instanceof Gene) {
            url = '../Evolution/Molecules/dna.pdb';
            format ='pdb';
        }
        else{
            switch (molecule)
            {
                case SiteEnum.A: url = Adenine; break;
                case SiteEnum.C: url = Cytosine; break;
                case SiteEnum.G: url = Guanine; break;
                case SiteEnum.T: url = Thymine; break;
                case SiteEnum.U: url = Uracil; break;
                default:
                    //Otherwise - using URL to download data:
                    url = `../Evolution/Molecules/${this.getSiteName(molecule)}.mol`;       //${SiteEnum[<SiteEnum>molecule]}
                    //url = `Evolution/Molecules/${SiteEnum[molecule]}.mol`;
                    //url = helper.root(`Evolution/Molecules/${SiteEnum[molecule]}.mol`);
                    break;
            }
            format = 'mol';
        }
        return {url: url, format: format};
    }
}
