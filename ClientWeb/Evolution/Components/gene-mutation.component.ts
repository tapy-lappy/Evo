import {
    Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges,
    AfterContentChecked, Inject, OnDestroy
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import Gene from "../Models/gene";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import Site from "../Models/site";
import ObjectHelper from "../Helpers/object-helper";
import {SiteMutationArrayComponent} from "./site-mutation-array.component";
import ReactFormBuilderFactory from "../Factories/react-form-builder.factory";
import {SiteEnum} from "../Enums/site-enum";
import {ArrayHelper} from "../Helpers/array-helper";
import {FormValidator, formValidatorProvider} from "../Validation/form-validator";
import {CONTROL_ERRORS_TOKEN, ControlErrors, VALIDATION_SCHEME_TOKEN, ValidationScheme} from "../Validation/validation-scheme";
import {ErrorAccumulator} from "../Abstract/interfaces";
import DI from "../Helpers/di-helper";
import {Subscription} from "rxjs/Subscription";
import {ForbiddenValidator} from "../Validation/validators";

@Component({
    moduleId: module.id,
    selector: 'gene-mutation',
    styles: [String(require('../Css/markup.less')), String(require('../Css/validation.less'))],
    templateUrl: '../Html/gene-mutation.component.html',
    providers: [formValidatorProvider]
})

export class GeneMutationComponent extends BaseGeneComponent implements OnInit, OnChanges, OnDestroy/*, AfterContentChecked*/{
    @Input() gene: Gene;
    @Output('submitted') submittedEvent: EventEmitter<Gene> = new EventEmitter<Gene>();
    private descriptionContent = 'please descriebe...';
    private mutationForm: FormGroup;
    private validationSubscription: Subscription;
    private validator: FormValidator;
    private errors: ErrorAccumulator = {};

    private get sitesFormGroups():FormArray{
        return this.mutationForm.get('formGroups') as FormArray;     //Remark: this is FormArray of FormGroups
    }

    private get sitesSource(): Site[]{
        return ArrayHelper.notEmpty(this.gene.mutationSites) ? this.gene.mutationSites : this.gene.sites;
    }

    constructor(private formBuilder: FormBuilder/*, private mutationService: MutationService*/) {
        super();
    }

    ngOnInit(): void {
        this.mutationForm = this.formBuilder.group({
            description: [this.descriptionContent, [Validators.required, Validators.minLength(4),
                Validators.maxLength(50), ForbiddenValidator(/description/i)]],  //this.formBuilder.control('description', Validators.required),
            //empty array init:                     this.formBuilder.array([])
            //form group with site instance init:        this.formBuilder.group(new Site())
            //array of form groups of site instances:    this.formBuilder.array([this.formBuilder.group(new Site(SiteEnum.A))])

            //formGroups: this.formBuilder.array([])
            formGroups: ReactFormBuilderFactory.builder(SiteMutationArrayComponent, {provide: FormBuilder, useValue: this.formBuilder})
                (this.sitesSource)
        });
        //Explanation: The reason why we populate form with data here is because @Input() gene: Gene is undefined in constructor:
        // const formModel = ReactFormBuilderFactory.builder(SiteMutationArrayComponent, {provide: FormBuilder, useValue: this.formBuilder})
        //     (this.sitesSource);
        // this.mutationForm.setControl('formGroups', formModel);


        let controlErrors:ControlErrors = {
            'description': ''
        };
        this.validator = DI.resolve<FormValidator>(FormValidator, formValidatorProvider,
            {provide: FormGroup, useValue: this.mutationForm},
            {provide: CONTROL_ERRORS_TOKEN, useValue: controlErrors},           //uses specific customized object
            {provide: VALIDATION_SCHEME_TOKEN, useClass: ValidationScheme});    //uses already defined global error messages container
        this.validationSubscription = this.mutationForm.valueChanges.subscribe(data => {
            this.errors = this.validator.onValueChanged(data);});
        //this.validator.onValueChanged(); // (re)set validation messages now         //TODO: do we really need it?
    }
    ngOnChanges(changes: SimpleChanges): void {
        //to clear control values from the previous gene and restore status flags to the pristine state need
        //to call reset at the top of ngOnChanges:
        //this.mutationForm.reset();      //https://angular.io/guide/reactive-forms#reset-the-form-flags
    }
    // ngAfterContentChecked(): void {
    //     this.mutationForm.valueChanges.subscribe(data =>{
    //        const descriptionCtrl = this.mutationForm.get('description');
    //        if(descriptionCtrl && !descriptionCtrl.valid){
    //            this.errors.push(descriptionCtrl.errors['required']);
    //        }
    //     });
    // }
    ngOnDestroy(): void {
        this.validationSubscription.unsubscribe();
    }


    private stopEventPropagation(event: Event){
        this.stopPropagation(event);
    }

    private enableActions(){
        this.mutationForm.markAsDirty({onlySelf: true});     //marks only mutationForm, not it's ancestors
    }

    private reset(initialState?:any){
        this.mutationForm.reset(initialState);      //https://angular.io/guide/reactive-forms#reset-the-form-flags
    }
    private onSubmit(){
        const geneDeepCopy = this.prepareChanges();
        this.submittedEvent.emit(geneDeepCopy);
        this.reset();                               //TODO: cause changes into mutationForm's model - in HTML see output of <p>Form value: {{ mutationForm.value | json }}</p>
    }
    private onCancel(){
        //Problem: we can't use reset(this.initialState), it works incorrectly with Validators.required(and other validators) & don't work with FormArray at all
        //Explanation: https://stackoverflow.com/a/41179817 The 'setValue' method takes ONLY simple values:
        let initialState = {
            description: this.descriptionContent,  //without validation!!!
            formGroups: this.sitesSource   //not FormArray of FormGroups
        }
        this.reset(initialState);      //reset form flags(pristine, touched, dirty etc.) and revert control value changes by reseting them to this.initialState

        //Workaround: Cancel changes with recreating whole parent FormGroup - reinitialization form model with initial data:
        //this.ngOnInit();
    }
    private prepareChanges():Gene{
        const formModel = this.mutationForm.value;

        //TODO: must be implemented with MutationService:
        //Fixme: Set up mutation sites into gene with MutationService
        //this.mutationService.updateGene(preparedGene, formModel.formGroups);    //TODO: implementation

        this.gene.mutationSites = <Site[]>ObjectHelper.cast(Site, formModel.formGroups);    //Error: formModel.formGroups.controls
        return <Gene>ObjectHelper.deepCopy(Gene, this.gene);
    }
}