import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({ selector: '[appRoundBlock]' })
export class LazyimgDirective {
    constructor(renderer: Renderer2, elmRef: ElementRef) {
      console.log(elmRef.nativeElement);
      renderer.setStyle(elmRef.nativeElement, 'color','#FF0000');
    }
  }
