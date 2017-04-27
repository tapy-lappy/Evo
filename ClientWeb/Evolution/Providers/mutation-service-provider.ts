import {AppState} from "../AppState/app-state";
import MutationService from "../Services/mutation.service";

let mutationServiceFactory = (appState: AppState): MutationService => {
    return new MutationService(appState.state.mutationEnabled)
}

export let mutationServiceProvider = {
    provide: MutationService,
    useFactory:  mutationServiceFactory,
    deps: [AppState]
};