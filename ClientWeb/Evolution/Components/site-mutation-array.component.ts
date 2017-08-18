import {Component, EventEmitter, Injectable, Input, Output} from '@angular/core';
import Site from "../Models/site";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {SiteMutationComponent} from "./site-mutation.component";
import {SiteEnum} from "../Enums/site-enum";
import {ReactFormBuilder} from "../Abstract/react-form-builder";
import {Resolvable} from "../Abstract/resolvable";
import ReactFormBuilderFactory from "../Factories/react-form-builder.factory";
import {ArrayHelper} from "../Helpers/array-helper";

@Component({
    moduleId: module.id,
    selector: 'site-mutation-array-component',
    templateUrl: '../Html/site-mutation-array-component.component.html'
})
//TODO: make array-component generic with AR(add/remove) interface. add() and remove() methods must be set up with appropriate functions
//TODO: from parent component(if they needed). This allows to use the same approach everywhere and have only one array-component to display
//TODO: arrays. Setting up AR with callback methods means parent component may adjust their logic.
export class SiteMutationArrayComponent implements ReactFormBuilder, Resolvable{
    @Input() formArray: FormArray;
    @Output('added') addedEvent = new EventEmitter();
    @Output('removed') removeEvent = new EventEmitter();

    constructor(private fb: FormBuilder) {
    }

    build<SiteMutationArrayComponent>(initializationData?: Site[]): FormArray {
        const array = this.fb.array([]);
        if (initializationData) {
            const builder = this.getFormModelBuilder();
            initializationData.forEach(site => array.push(builder(site)));
        }
        return array;
    }

    private getFormModelBuilder(){
        return ReactFormBuilderFactory.builder(SiteMutationComponent, {provide: FormBuilder, useValue: this.fb});
    }

    private isNotEmpty(){
        return this.formArray ? ArrayHelper.notEmpty(this.formArray.controls) : false;
    }

    private add(){
        this.formArray.push(this.getFormModelBuilder()(new Site(SiteEnum.A)));
        this.addedEvent.emit();
    }

    private remove(id: Symbol){
        let formGroupIndex = this.formArray.controls.findIndex((fg:FormGroup) => {
            return fg.controls.id.value === id      //fg.controls.id - it's FormControl
        });

        //TODO: this is removing FormControl from FormGroup(form model), BUT it do not remove it from  formArray.value:
        // let removeFormGroups = this.formArray.controls.splice(formGroupIndex, 1); //remove only control(but there are no changes in form model)
        //Done: this is removing from both:
        this.formArray.removeAt(formGroupIndex);

        this.removeEvent.emit();
    }
}