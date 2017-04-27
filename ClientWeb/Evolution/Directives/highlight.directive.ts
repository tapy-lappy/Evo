import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[highlight]',
    inputs: ['backgroundColor:highlight']
})
export class HighlightDirective {
    //TODO: clarify how to use different @Input name (then directive selector)
    //@Input('highlight') backgroundColor: string;
    backgroundColor: string;
    private el: HTMLElement;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    @HostListener('mouseenter')
    onMouseEnter(){
        this.highlight(this.backgroundColor || '#dbdbdb');
    }
    @HostListener('mouseleave')
    onMouseLeave(){
        this.highlight(null);
    }

    highlight(color: string){
        this.el.style.backgroundColor = color;
    }
}