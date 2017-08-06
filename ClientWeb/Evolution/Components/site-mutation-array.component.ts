import {Component, EventEmitter, Injectable, Input, Output} from '@angular/core';
import Site from "../Models/site";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {SiteMutationComponent} from "./site-mutation.component";
import {SiteEnum} from "../Enums/site-enum";
import {ReactFormBuilder} from "../Abstract/react-form-builder";
import {Resolvable} from "../Abstract/resolvable";

@Component({
    moduleId: module.id,
    selector: 'site-mutation-array-component',
    templateUrl: '../Html/site-mutation-array-component.component.html'
})
//TODO: make array-component generic with AR(add/remove) interface. add() and remove() methods must be set up with appropriate functions
//TODO: from parent component(if they needed). This allows to use the same approach everywhere and have only one array-component to display
//TODO: arrays. Setting up AR with callback methods means parent component may adjust their logic.
export class SiteMutationArrayComponent extends ReactFormBuilder implements Resolvable{
    @Input() formArray: FormArray;
    @Output('added') addedEvent = new EventEmitter();
    @Output('removed') removeEvent = new EventEmitter();

    constructor(private fb: FormBuilder) {
        super();
    }

    build<SiteMutationArrayComponent>(initializationData?: Site[]): FormArray {
        //return SiteMutationArrayComponent.build(initializationData);      //static approach
        const array = this.fb.array([]);
        if (initializationData) {
            initializationData.forEach(site => array.push(SiteMutationComponent.build(site)));  //FixMe: static approach
            // const sitesFormGroups = data.map(site => SiteMutationComponent.build(site));
            // const array = fb.array(sitesFormGroups);
        }
        return array;

    }

    // private static build<Site>(data?: Site[]):FormArray{
    //     const fb = new FormBuilder();
    //     const array = fb.array([]);
    //     data.forEach(site => array.push(SiteMutationComponent.build(site)));
    //     // const sitesFormGroups = data.map(site => SiteMutationComponent.build(site));  //static approach
    //     // const array = fb.array(sitesFormGroups);
    //     return array;
    // }

    private add(){
        this.formArray.push(SiteMutationComponent.build(new Site(SiteEnum.A)));
        this.addedEvent.emit();
    }

    private remove(id: Symbol){
        let formGroupIndex = this.formArray.controls.findIndex((fg:FormGroup) => {
            return fg.controls.id.value === id      //fg.controls.id - it's FormControl
        });

        //TODO: this is removing FormControl from FormGroup(form model), BUT it do not remove it from  formArray.value:
        // let removeFormGroups = this.formArray.controls.splice(formGroupIndex, 1); //remove only control(but there are no changes in form model)
        //Done: this is removing from both:
        this.formArray.removeAt(formGroupIndex);  //remove form group from form model

        this.removeEvent.emit();
    }
}