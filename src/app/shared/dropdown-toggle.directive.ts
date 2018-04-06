import { Directive, Inject, forwardRef, ElementRef } from '@angular/core';

import { DropdownDirective } from './dropdown.directive';

@Directive({
  selector: '[appDropdownToggle]',
  host: {
    '[class.dropdown-toggle]': 'true',
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'dropdown.isOpen()',
    '(click)': 'onClick()'
  }
})
export class DropdownToggleDirective {

  constructor(@Inject(forwardRef(() => DropdownDirective)) public dropdown, private elementRef: ElementRef) { }

  onClick() {
    this.dropdown.toggle();
  }
  
  // eventFrom(event): boolean {
  //   return this.elementRef.nativeElement.contains(event.target);
  // }
}
