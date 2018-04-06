import { Directive, Inject, forwardRef, ElementRef, Input } from '@angular/core';

import { DropdownDirective } from './dropdown.directive';

@Directive({
  selector: '[appDropdownMenu]',
  host: {
    '[class.dropdown-menu]': 'true',
    '[style.min-width]': '"auto"',
    '[class.show]': 'dropdown.isOpen()',
    '(click)': 'onClick()'
  }
})
export class DropdownMenuDirective {
  @Input() autoClose: boolean;

  constructor(@Inject(forwardRef(() => DropdownDirective)) public dropdown, private elementRef: ElementRef) { }

  onClick() {
    if (this.autoClose) this.close();
  }

  close() {
    this.dropdown.close()
  }


  // eventFrom(event): boolean {
  //   return this.elementRef.nativeElement.contains(event.target);
  // }

}
