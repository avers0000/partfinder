import { Directive, HostBinding, ContentChild, ElementRef } from '@angular/core';

import { DropdownToggleDirective } from './dropdown-toggle.directive';
import { DropdownMenuDirective } from './dropdown-menu.directive';

@Directive({
  selector: '[appDropdown]',
  host: {
    '[class.dropdown]': 'true',
    '[class.show]': 'isOpen()',
    '(document:keyup.esc)': 'close()',
    '(document:click)': 'onClick($event)' 
  }
})
export class DropdownDirective {
  open: boolean = false;
  // @ContentChild(DropdownToggleDirective) private toggleButton: DropdownToggleDirective;
  // @ContentChild(DropdownMenuDirective) private menu: DropdownMenuDirective;

  constructor(private elementRef: ElementRef) { }

  isOpen():boolean {
    return this.open;
  }

  toggle(): void {
    this.open = !this.open;
  }

  close(): void {
    this.open = false;
  }

  onClick(event: Event): void {
    if (this.isOpen() && !this.isEventFromDropdown(event)){
      this.close();
    }
  }

  private isEventFromDropdown(event): boolean {
    return this.elementRef.nativeElement.contains(event.target);
  }

  // private isEventFromToggle(event): boolean {
  //   return this.toggle ? this.toggleButton.eventFrom(event) : false;
  // }

  // private isEventFromMenu(event): boolean {
  //   return this.toggle ? this.toggleButton.eventFrom(event) : false;
  // }

}
