import {InjectionToken} from "@angular/core";

enum GeneEnum{
    Human = 48, Ape = 24, Worm = 8, Jellyfish = 16, Unknown = -1
}

const GENE_ENUM_TOKEN = new InjectionToken<GeneEnum>('gene-Enum');

export {GENE_ENUM_TOKEN, GeneEnum}