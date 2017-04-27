import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';
import {DnaEnum} from "../Enums/dna-enum";


export interface State {
// define your state here
    mutationEnabled: boolean,
    selectedDnas: DnaEnum[],
    availableDnas: Array<DnaEnum>
}

const defaultState: State = {
// define your initial state here
    mutationEnabled: false,
    selectedDnas: [],
    availableDnas: [DnaEnum.Human, DnaEnum.Ape, DnaEnum.Jellyfish, DnaEnum.Worm]
}

const _state = new BehaviorSubject<State>(defaultState);

@Injectable()
export class AppState {
    private _state = _state;
    changes = this._state
        .asObservable()
        .distinctUntilChanged()

    set state(state: State) {
        this._state.next(state);
    }

    get state(): State {
        return this._state.value;
    }

    purge() {
        this._state.next(defaultState);
    }
}