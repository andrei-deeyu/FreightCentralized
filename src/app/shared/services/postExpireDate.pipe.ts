import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postExpireDate'
})
export class postExpireDatePipe implements PipeTransform {
  transform(value: Date, valability: string) {
    if( !value ) return null;

    let valabilityDays = Number(valability.split('days')[0]);
    let oneDayMiliseconds = 86400000;
    let valabilityDate:number = valabilityDays* oneDayMiliseconds;

    let expireDate = new Date(new Date(value).getTime() + valabilityDate);

    return expireDate;
  }
}