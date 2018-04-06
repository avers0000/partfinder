import { Directive, Inject, forwardRef, ElementRef, Input } from '@angular/core';
import { DropdownMenuDirective } from './dropdown-menu.directive';


@Directive({
  selector: '[appDropdownCloseElement]',
  host: {
    '(click)': 'onClick()'
  }
})
export class DropdownCloseElementDirective {
  @Input() dropdownCloseCondition: boolean = true;

  constructor(@Inject(forwardRef(() => DropdownMenuDirective)) public dropdownMenu, private elementRef: ElementRef) { }

  onClick() {
      if (this.dropdownCloseCondition) this.closeDropdown();
  }

  closeDropdown() {
    this.dropdownMenu.close();
  }

}