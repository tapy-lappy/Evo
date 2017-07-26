import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import Gene from "../Models/gene";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import {SiteEnum} from "../Enums/site-enum";
import EnumHelper from "../Helpers/enum-helper";
import Site from "../Models/site";

@Component({
    moduleId: module.id,
    selector: 'gene-mutation',
    //styles: [String(require('../Css/gene-mutation.component.less'))],
    templateUrl: '../Html/gene-mutation.component.html',
})

export class GeneMutationComponent extends BaseGeneComponent implements OnInit{
    @Input() gene: Gene;
    private siteItems = EnumHelper.getNames(SiteEnum);
    private mutationForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        super();
        this.initForm();
    }
    initForm(){
        this.mutationForm = this.formBuilder.group({
            description: ['description message', Validators.required],
            //empty array init:                     this.formBuilder.array([])
            //group with site instance init:        this.formBuilder.group(new Site())
            //array of groups of site instances:    this.formBuilder.array([this.formBuilder.group(new Site(SiteEnum.A))])
            sites: this.formBuilder.array([])
        })
    }
    ngOnInit(): void {
        //Explanation: The reason why we populate form with data here - it's that  @Input() gene: Gene is undefined in constructor:
        this.setSites(this.gene.sites);
    }
    private setSites(sites:Site[]){
        const formGroups = sites.map(site => this.formBuilder.group(
            /*site*/    //TODO: clarify why doesn't work with the same 'site' structure from instance and why it works when I map all the 'site' properties manually:
            {
                site: this.getSiteName(site.site),       //TODO: maybe use enum values instead of strings in site control
                isMutated: site.isMutated,
                mutationLabel: site.isMutated ? 'Mutated' : 'No mutation'
            }));
        const arrayOfFormGroups = this.formBuilder.array(formGroups);
        this.mutationForm.setControl('sites', arrayOfFormGroups);
    }
    private get sitesFormGroups():FormArray{
        return this.mutationForm.get('sites') as FormArray;
    }

    private stopEventPropagation(event: Event){
        this.stopPropagation(event);
    }
}