import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';
import {/*GeneEnum,*/ default as GeneStorage} from "../Models/gene-storage";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import Gene from "../Models/gene";
import {SiteEnum} from "../Enums/site-enum";
import Site from "../Models/site";


export interface State {
// define your state here
    mutationEnabled: boolean,
    selectedGenes: GeneStorage,//GeneEnum[],
    availableGenes: GeneStorage,//Array<GeneEnum>,
    mutationChanged$?: Observable<boolean>,         //Remark: added ? to make property optional and avoid problem with its default implementation into defaultState
    mutationChange?: (enabled: boolean) => void     //Remark: added ? to make property optional and avoid problem with its default implementation into defaultState
}

const defaultState: State = {
// define your initial state here
    mutationEnabled: false,
    selectedGenes: new GeneStorage(),      //[],
    availableGenes: new GeneStorage(
        //TODO: find a way to map/transform SiteEnum to Site
        new Gene('HFE', [new Site(SiteEnum.A), new Site(SiteEnum.C), new Site(SiteEnum.G), new Site(SiteEnum.C), new Site(SiteEnum.U), new Site(SiteEnum.C)], 'Excess of iron in the body'),  //Surplus
        new Gene('ALDH2', [new Site(SiteEnum.G), new Site(SiteEnum.T),new Site(SiteEnum.U), new Site(SiteEnum.A), new Site(SiteEnum.C), new Site(SiteEnum.G)], 'Alcohol intolerance')
    ).add(new Gene('GJB2', [new Site(SiteEnum.A), new Site(SiteEnum.C), new Site(SiteEnum.G), new Site(SiteEnum.T), new Site(SiteEnum.U)], 'Deafness')),
    mutationChanged$: undefined,
    mutationChange: undefined   //Note: possible to use empty implementation: (enabled: boolean) => {}
}

//const _state = new BehaviorSubject<State>(defaultState);

@Injectable()
export class AppState{

    //private _state = _state;
    // changes = this._state
    //     .asObservable()
    //     .distinctUntilChanged();
    //
    // set state(state: State) {
    //     this._state.next(state);
    // }
    //
    // get state(): State {
    //     return this._state.value;
    // }
    //
    // purge() {
    //     this._state.next(defaultState);
    // }
    state = defaultState;
    private mutationChangedSource: Subject<boolean> = new Subject<boolean>();
    constructor(){
        let currentAppState:State = this.state;//_state.value;
        currentAppState.mutationChange = (enabled: boolean) => {
            //function (enabled: boolean) {
            currentAppState.mutationEnabled = enabled;
            this.mutationChangedSource.next(enabled);
        };
        currentAppState.mutationChanged$ = this.mutationChangedSource.asObservable();
    }
}