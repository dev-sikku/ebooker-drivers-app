import {Directive, effect, ElementRef, input, OnInit, output} from '@angular/core';

declare var google: any;

@Directive({
  selector: '[appGoogleAddressAutoComplete]',
  standalone: true
})
export class GoogleAddressAutoCompleteDirective implements OnInit {
  configs = input<{ bounds: any, componentRestrictions: any }>();
  location = input();
  addressChange = output<any>();
  #autocomplete: any;

  constructor(private el: ElementRef) {
    effect(() => {
      if (this.location()) {
        this.#autocomplete.setBounds(new google.maps.LatLngBounds(this.location(), this.location()));
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({location: this.location()}, (results: any, status: any) => {
          if (status === 'OK') {
            let route = (results || []).find((x: any) => (x.types || []).includes('route'));
            route && this.addressChange.emit(route);
          } else {
            console.error('Geocoder failed:', status);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.#autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement, this.configs() || {});

    this.#autocomplete.addListener('place_changed', () => {
      const place = this.#autocomplete.getPlace();
      if (place.geometry) {
        this.addressChange.emit(place);
      }
    });
  }

}
