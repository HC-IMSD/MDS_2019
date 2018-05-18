import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'keys'
})
export class JsonKeysPipe implements PipeTransform {

  /**
   * Transforms a list of json objects into an array
   * Creates key value pairs
   * @param value
   * @param {string[]} args
   * @returns {any}
   */
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }

}
