import {Component, OnInit} from '@angular/core';
import Gene from "../Models/gene";
import {ActivatedRoute} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'gene-editor',
    templateUrl: '../Html/gene-editor.component.html'
})

export class GeneEditorComponent implements OnInit {
    // get geneName() {return this.gene.name;}
    // get geneDescription() {return this.gene.description;}
    name: string;
    constructor(/*public gene:Gene*/) {

    }

    ngOnInit() {
    }
}
