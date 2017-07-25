import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Gene from "../Models/gene";
import {BaseGeneComponent} from "../Abstract/base-gene.component";

@Component({
    moduleId: module.id,
    selector: 'gene-mutation',
    //styles: [String(require('../Css/gene-mutation.component.less'))],
    templateUrl: '../Html/gene-mutation.component.html',
})

export class GeneMutationComponent extends BaseGeneComponent{
    @Input() gene: Gene;
    private mutationForm: FormGroup;

    constructor(private formBuiler: FormBuilder) {
        super();
        this.initForm();
    }

    initForm(){
        this.mutationForm = this.formBuiler.group({
            site: ['', Validators.required]
        })
    }

    private stopEventPropagation(event: Event){
        this.stopPropagation(event);
    }
}