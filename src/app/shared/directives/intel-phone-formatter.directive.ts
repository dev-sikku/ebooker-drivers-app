import {Directive, ElementRef, HostListener, OnInit, output} from '@angular/core';
import {MobileNumber} from "../interfaces/phone-number.interface";

declare var intlTelInput: any;

@Directive({
  selector: '[appIntelPhoneFormatter]',
  standalone: true
})
export class IntelPhoneFormatterDirective implements OnInit {
  value = output<MobileNumber>();

  instance: any;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.instance = intlTelInput(this.el.nativeElement, {
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js",
      autoPlaceholder: "aggressive",
      separateDialCode: true,
      formatOnDisplay: false,
      initialCountry: 'gb',
      customPlaceholder: function (selectedCountryPlaceholder: any, selectedCountryData: any) {
        return "e.g. " + selectedCountryPlaceholder;
      },
    });
  }

  @HostListener('blur')
  onBlur() {
    if (this.instance.isValidNumber()) {
      const pn = this.instance.getNumber(0);
      this.value.emit({pn, country: this.instance.j, valid: true});
    } else {
      this.value.emit({pn: '', country: '', valid: false});
    }
  }
}
