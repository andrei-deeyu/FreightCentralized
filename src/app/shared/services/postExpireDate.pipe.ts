import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postExpireDate'
})
export class postExpireDatePipe implements PipeTransform {
  transform(value: Date, valability: string) {
    if( !value ) return null;

    const valabilityDays = Number(valability.split('days')[0]);
    const oneDayMiliseconds = 86400000;
    const valabilityDate:number = valabilityDays* oneDayMiliseconds;

    const expireDate = new Date(new Date(value).getTime() + valabilityDate);

    return expireDate;
  }
}