import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  transform(value: any, limit?: number): any {
    if (limit && value.length > limit) {
      return value.substr(9, limit) + ' ...';
    }
    return value;
  }

}
