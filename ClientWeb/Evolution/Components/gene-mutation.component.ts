import {
    Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges,
    AfterContentChecked
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import Gene from "../Models/gene";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import Site from "../Models/site";
import ObjectHelper from "../Helpers/object-helper";
import {SiteMutationArrayComponent} from "./site-mutation-array.component";
import ReactFormBuilderFactory from "../Factories/react-form-builder.factory";

@Component({
    moduleId: module.id,
    selector: 'gene-mutation',
    styles: [String(require('../Css/markup.less')), String(require('../Css/validation.less'))],
    templateUrl: '../Html/gene-mutation.component.html',
})

export class GeneMutationComponent extends BaseGeneComponent implements OnInit, OnChanges, AfterContentChecked{
    @Input() gene: Gene;
    @Output('submitted') submittedEvent: EventEmitter<Gene> = new EventEmitter<Gene>();
    private mutationForm: FormGroup;
    private errors: string[] = [];

    private get sitesFormGroups():FormArray{
        return this.mutationForm.get('formGroups') as FormArray;     //Remark: this is FormArray of FormGroups
    }

    private get initialState(){
        return {
            description: ['description message', Validators.required],
            //empty array init:                     this.formBuilder.array([])
            //form group with site instance init:        this.formBuilder.group(new Site())
            //array of form groups of site instances:    this.formBuilder.array([this.formBuilder.group(new Site(SiteEnum.A))])
            formGroups: this.formBuilder.array([])
        };
    }

    constructor(private formBuilder: FormBuilder/*, private mutationService: MutationService*/) {
        super();
    }

    ngOnInit(): void {
        this.mutationForm = this.formBuilder.group(this.initialState);
        //Workaround Explanation: The reason why we populate form with data here is because @Input() gene: Gene is undefined in constructor:
        this.setSites(this.gene.mutationSites.length > 0 ? this.gene.mutationSites : this.gene.sites);
    }
    ngAfterContentChecked(): void {
        this.mutationForm.valueChanges.subscribe(data =>{
           const descriptionCtrl = this.mutationForm.get('description');
           if(descriptionCtrl && !descriptionCtrl.valid){
               this.errors.push(descriptionCtrl.errors['required']);
           }
        });
    }

    private setSites(sites:Site[]){
        //const formModel = SiteMutationArrayComponent.build(sites);    //static approach
        const formModel = ReactFormBuilderFactory.builder(SiteMutationArrayComponent, {provide: FormBuilder, useValue: this.formBuilder})(sites);
        this.mutationForm.setControl('formGroups', formModel);
    }


    private stopEventPropagation(event: Event){
        this.stopPropagation(event);
    }

    private enableActions(){
        this.mutationForm.markAsDirty({onlySelf: true});     //marks only mutationForm, not it's ancestors
    }
    ngOnChanges(changes: SimpleChanges): void {
        //to clear control values from the previous gene and restore status flags to the pristine state need
        //to call reset at the top of ngOnChanges:
        //this.mutationForm.reset();      //https://angular.io/guide/reactive-forms#reset-the-form-flags
    }
    private reset(initialState?:any){
        this.mutationForm.reset(initialState);      //https://angular.io/guide/reactive-forms#reset-the-form-flags
    }
    private onSubmit(){
        this.gene = this.prepareChanges();         //Workaround
        //this.mutationService.updateGene(preparedGene);    //TODO: implementation
        this.reset();                               //TODO: cause changes into mutationForm's model - in HTML see output of <p>Form value: {{ mutationForm.value | json }}</p>

        //this.submittedEvent.emit(ObjectHelper.deepTreeCopy(this.gene));   //TODO: need to implement deep copy for tree structure(better if as overload for deepCopy(and overload for arrays too!))
        this.submittedEvent.emit(this.gene);
    }
    private onCancel(){
        // //Explanation: this approach with reset(initialState) works incorrectly with Validators.required(and other validators)
        // this.reset(this.initialState);      //reset form flags(pristine, touched, dirty etc.) and revert control value changes by reseting them to this.initialState
        // //Workaround: to populate reseted form with restored data:
        // this.setSites(this.gene.mutationSites.length > 0 ? this.gene.mutationSites : this.gene.sites);

        //Cancel changes with recreating whole parent FormGroup - reinitialization form model with initial data:
        this.ngOnInit();
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