import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumAlias'
})
export class EnumAliasPipe implements PipeTransform {

  transform(value: any, aliases: string[]): any {
    return (value != undefined && value != null) ? aliases[value] : value;
  }

}
