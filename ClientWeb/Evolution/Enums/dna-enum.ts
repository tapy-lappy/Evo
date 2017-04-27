import {InjectionToken} from "@angular/core";

enum DnaEnum{
    Human = 48, Ape = 24, Worm = 8, Jellyfish = 16, Unknown = -1
}

const DNA_ENUM_TOKEN = new InjectionToken<DnaEnum>('dna-Enum');

export {DNA_ENUM_TOKEN, DnaEnum}