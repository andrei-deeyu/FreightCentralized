import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postPastTense'
})
export class postPastTense implements PipeTransform {
  transform(value: Date) {
    if( !value ) return null;

    const oneSecond = 1000;
    const oneMinute = oneSecond * 60;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;
    const oneWeek = oneDay * 7;
    const oneMonth = oneWeek * 4;

    const pastTense = Date.now() - new Date(value).getTime();

    switch(true) {
      case pastTense < oneSecond * 10:
          return 'now';
      case pastTense < oneMinute:
        return Math.round(pastTense / oneSecond) + 'seconds'
      case pastTense < oneHour:
        return Math.round(pastTense / oneMinute) + 'minutes'
      case pastTense < oneDay:
        return Math.round(pastTense/ oneHour) + 'hours'
      case pastTense < oneWeek:
        return Math.round(pastTense / oneDay) + 'days'
      case pastTense < oneWeek:
        return Math.round(pastTense / oneWeek) + 'weeks'
      case pastTense >= oneMonth:
        return Math.round(pastTense / oneMonth) + 'months'
      }
    return pastTense;
  }
}