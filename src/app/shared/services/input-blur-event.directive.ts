import {
  Directive,
  EventEmitter,
  HostListener,
  Output,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[inputBlurEvent]',
})
export class InputBlurEventDirective {
  @Output() inputBlurEvent: EventEmitter<InputEvent> = new EventEmitter();


  @HostListener('blur', ['$event'])
  onBlur( event: InputEvent ):void {
    console.log('blur = true')
    console.log(event.target)
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.inputBlurEvent.emit(event);
    }
  }
  constructor(private elementRef: ElementRef) {}
}