import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { EvolutionModule } from './Modules/evolution.module';
import { bootloader } from '@angularclass/hmr'; //bootloader is only needed to detect that the dom is ready before bootstraping otherwise bootstrap
import { enableProdMode, isDevMode } from '@angular/core';

// Enable production mode unless running locally
if (IS_PRODUCTION && METADATA.IS_PRODUCTION && !/localhost/.test(document.location.host)) {
    enableProdMode();
    console.log("PRODUCTION MODE ENABLED:", !isDevMode());  //isDevMode() - After called ONCE, the value is locked and won't change any more.
}

function main(): Promise<any> {
    return platformBrowserDynamic().bootstrapModule(EvolutionModule)
    //.then(decorateModuleRef)
        .then(success => console.log(`Bootstrap success`))
        .catch(error => console.error(error));
}

// boot on document ready
bootloader(main);
