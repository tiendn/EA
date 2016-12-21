import { Pipe, PipeTransform } from '@angular/core';
import { Helper } from '../common/helper'; 

@Pipe({
    name: 'formatNumber'
})

export class FormatNumber implements PipeTransform {
    constructor(private helper: Helper) {
    }

    transform(value: number, decimalPlaces: number): string {
        return this.helper.formatNumber(value, decimalPlaces);
    }
}