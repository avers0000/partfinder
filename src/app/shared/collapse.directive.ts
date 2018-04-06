import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCollapse]',
  // this can be used instead of HostBindings in the body
  // host: {'[class.collapse]': 'true', '[class.show]': '!pfcollapsed'}
})
export class CollapseDirective {
  @Input() appCollapse: boolean = false;
  @HostBinding('class.collapse') classCollapse: boolean = true;
  @HostBinding('class.show')
  get show(): boolean {
    return !this.appCollapse;
  }

  constructor() { }
  
}
