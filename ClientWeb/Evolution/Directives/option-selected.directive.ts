import {Directive, ElementRef, Input, Renderer, Renderer2} from "@angular/core";

@Directive({
    selector: '[option-selected]'
})
export class OptionSelectedDirective{
    @Input('option-selected') set condition(condition: boolean){
        if (condition)
            this.renderer.setAttribute(this.el, 'selected', 'true');
    };
    private el: HTMLElement;

    constructor(el: ElementRef, private renderer: Renderer2){
        this.el = el.nativeElement;
    }
}