import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import Gene from "../Models/gene";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import {SiteEnum} from "../Enums/site-enum";
import EnumHelper from "../Helpers/enum-helper";
import Site from "../Models/site";
import ObjectHelper from "../Helpers/object-helper";

@Component({
    moduleId: module.id,
    selector: 'gene-mutation',
    styles: [String(require('../Css/gene-mutation.component.less'))],
    templateUrl: '../Html/gene-mutation.component.html',
})

export class GeneMutationComponent extends BaseGeneComponent implements OnInit{
    @Input() gene: Gene;
    @Output('submitted') submittedEvent: EventEmitter<Gene> = new EventEmitter<Gene>();
    private siteItems: Array<SiteEnum> = EnumHelper.getValues(SiteEnum);//EnumHelper.getNames(SiteEnum);
    private mutationForm: FormGroup;

    constructor(private formBuilder: FormBuilder/*, private mutationService: MutationService*/) {
        super();
        this.initForm();
    }
    initForm(){
        this.mutationForm = this.formBuilder.group({
            description: ['description message', Validators.required],
            //empty array init:                     this.formBuilder.array([])
            //form group with site instance init:        this.formBuilder.group(new Site())
            //array of form groups of site instances:    this.formBuilder.array([this.formBuilder.group(new Site(SiteEnum.A))])
            formGroups: this.formBuilder.array([])
        })
    }
    ngOnInit(): void {
        //Explanation: The reason why we populate form with data here - it's that  @Input() gene: Gene is undefined in constructor:
        this.setSites(this.gene.mutationSites.length > 0 ? this.gene.mutationSites : this.gene.sites);
    }
    private setSites(sites:Site[]){
        const formGroups = sites.map(site => this.formBuilder.group(
            site));    //TODO: clarify why doesn't work with the same 'site' structure from instance and why it works when I map all the 'site' properties manually:
            //Question: maybe site is processed as a property itself and it's needed to use it through this property: site.site, site.isMutated, not just like isMutated itself(in markup)
            // {
            //     site: this.formBuilder.control(this.getSiteName(site.site)),       //TODO: maybe use enum values instead of strings in site control
            //     isMutated: site.isMutated,
            //     mutationLabel: new FormControl({value: site.isMutated ? 'Mutated' : 'No mutation', disabled: true})
            // }));
        const arrayOfFormGroups = this.formBuilder.array(formGroups);
        this.mutationForm.setControl('formGroups', arrayOfFormGroups);

        this.sitesFormGroups.controls.forEach((fg:FormGroup) => this.setUpMutationChanges(fg));
    }
    private get sitesFormGroups():FormArray{
        return this.mutationForm.get('formGroups') as FormArray;     //Remark: this is FormArray of FormGroups
    }
    private setUpMutationChanges(fg:FormGroup) {
        //https://angular.io/guide/reactive-forms#observe-control-changes
        fg.controls.site.valueChanges.forEach((value:SiteEnum)=>{   //TODO: investigate Observable<any>. Also possible to use .subscriebe() but then need to unsubscriebe
            let isMutatedCtrl = fg.controls.isMutated;
            //if(isMutatedCtrl.value !== value)
                //isMutatedCtrl.patchValue({isMutated: true});    //https://angular.io/guide/reactive-forms#patchvalue
                isMutatedCtrl.setValue(true);    //https://angular.io/guide/reactive-forms#setvalue
        });
    }
    private stopEventPropagation(event: Event){
        this.stopPropagation(event);
    }
    private labelSiteMutation(isMutatedCtrl:FormControl){
        return isMutatedCtrl.value ? 'Mutated' : 'Original';    //isMutatedCtrl - it's FormControl here(it's based on Site structure where isMutated it's one of properties)
    }
    private addNewSite():void{
        let newFormGroup = this.formBuilder.group(new Site(SiteEnum.A));
        this.setUpMutationChanges(newFormGroup);
        this.sitesFormGroups.push(newFormGroup);
        this.enableSubmit();
    }
    private enableSubmit(){
        this.mutationForm.markAsDirty({onlySelf: true});     //marks only mutationForm, not it's ancestors
    }
    private removeSite(id:Symbol):void{
        let formGroupIndex = this.sitesFormGroups.controls.findIndex((fg:FormGroup) => {
            return fg.controls.id.value === id      //fg.controls.id - it's FormControl
        });

        //TODO: this is removing FormControl from FormGroup(form model), BUT it do not remove it from  mutationForm.value:
        // let removeFormGroups = this.sitesFormGroups.controls.splice(formGroupIndex, 1); //remove only control(but there are no changes in form model)
        //Done: this is removing from both:
        this.sitesFormGroups.removeAt(formGroupIndex);  //remove form group from form model
    }
    private reset(){
        this.mutationForm.reset();      //https://angular.io/guide/reactive-forms#reset-the-form-flags
    }
    private onSubmit(){
        const preparedGene = this.prepareChanges();         //Workaround
        //this.mutationService.updateGene(preparedGene);    //TODO: implementation
        this.reset();                               //TODO: cause changes into mutationForm's model - in HTML see output of <p>Form value: {{ mutationForm.value | json }}</p>

        //this.submittedEvent.emit(ObjectHelper.deepTreeCopy(this.gene));   //TODO: need to implement deep copy for tree structure(better if as overload for deepCopy(and overload for arrays too!))
        this.submittedEvent.emit(preparedGene);
    }
    private prepareChanges():Gene{
        const formModel = this.mutationForm.value;
        const mutatedSites: Site[] = ObjectHelper.deepCopyArray<Site>(formModel.formGroups);    //Error: formModel.formGroups.controls
        const gene:Gene = {
            name: this.gene.name,
            id: this.gene.id,
            sites: this.gene.sites,
            isMutated: this.gene.isMutated,             //Workaround: gene.isMutated is computable. It's bad approach to reinitialize it here
            //mutationSites: formModel.formGroups,      //TODO: Bad - need deep copy
            mutationSites: mutatedSites,                //Done
            description: formModel.description as string
        };
        return gene;
    }
}