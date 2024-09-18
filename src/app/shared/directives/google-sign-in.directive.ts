import {Directive, ElementRef, OnInit, output} from '@angular/core';
import {environment} from "../../../environments/environment";

declare const google: any;

@Directive({
  selector: '[appGoogleSignIn]',
  standalone: true
})
export class GoogleSignInDirective implements OnInit {
  callback = output();

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: environment.google.clientId,
      use_fedcm_for_prompt: true,
      callback: (response: any) => {
        this.callback.emit(response);
      }
    });

    google.accounts.id.renderButton(
      this.el.nativeElement,
      {theme: 'outline', size: 'large', logo_alignment: 'left', text: 'continue_with'} // customization options
    );
  }
}
