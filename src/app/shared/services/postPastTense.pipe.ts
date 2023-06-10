import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postPastTense'
})
export class postPastTense implements PipeTransform {
  transform(value: Date) {
    if( !value ) return null;

    let oneSecond = 1000;
    let oneMinute = oneSecond * 60;
    let oneHour = oneMinute * 60;
    let oneDay = oneHour * 24;
    let oneWeek = oneDay * 7;

    let pastTense = Date.now() - new Date(value).getTime();

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
    }
    return pastTense;
  }
}