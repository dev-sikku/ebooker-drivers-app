import {ChangeDetectorRef, Component, inject, model, OnInit, output, signal} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {Button, ButtonDirective} from "primeng/button";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputOtpModule} from "primeng/inputotp";
import {PasswordModule} from "primeng/password";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {StyleClassModule} from "primeng/styleclass";
import {NgTemplateOutlet} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {IntelPhoneFormatterDirective} from "../../shared/directives/intel-phone-formatter.directive";
import {GoogleSignInDirective} from "../../shared/directives/google-sign-in.directive";
import {AuthTypeEnum} from "../../shared/enums/auth-type.enum";
import {AuthService} from "../../core/services/auth.service";
import {RegisterStepEnum} from "../../shared/enums/register-step.enum";
import {LoginOtpStep} from "../../shared/enums/login-otp-step.enum";
import {MobileNumber} from "../../shared/interfaces/phone-number.interface";
import {ApplicationRoleEnum} from "../../shared/enums/application-role.enum";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonDirective,
    Button,
    ReactiveFormsModule,
    IntelPhoneFormatterDirective,
    InputOtpModule,
    FormsModule,
    PasswordModule,
    ToastModule,
    StyleClassModule,
    GoogleSignInDirective,
    NgTemplateOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  authType = model(AuthTypeEnum.login);
  close = output();

  messageService = inject(MessageService);
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);
  activatedRoute = inject(ActivatedRoute);
  loginForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required]),
    formattedPhoneNumber: new FormControl(''),
    password: new FormControl('', [Validators.required])
  });
  otpLoginForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required]),
    formattedPhoneNumber: new FormControl(''),
  });
  registerForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required]),
    formattedPhoneNumber: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  registerStep = RegisterStepEnum.VerifyPhoneNumber;
  otpLoginStep = LoginOtpStep.VerifyPhoneNumber;
  otp = '';
  loginOtp = '';
  mobileNumberValid = true;
  loginMobileNumberValid = true;
  otpLoginMobileNumberValid = true;
  loading = signal(false);
  completed = signal(false);

  protected readonly registerSteps = RegisterStepEnum;
  protected readonly optLoginSteps = LoginOtpStep;
  protected readonly authTypeEnum = AuthTypeEnum;

  get registerFC() {
    return this.registerForm.controls;
  }

  get loginFC() {
    return this.loginForm.controls;
  }

  get otpLoginFC() {
    return this.otpLoginForm.controls;
  }

  ngOnInit() {
    this.registerStep = RegisterStepEnum.VerifyPhoneNumber;
    this.activatedRoute.queryParams.subscribe(params => {
      const type = (params['type'] || '').toLowerCase();
      if (type == 'register') {
        this.authType.set(AuthTypeEnum.register);
      } else if (type == 'login') {
        this.authType.set(AuthTypeEnum.login);
      }
    });
  }

  setPhoneNumber(data: MobileNumber, type: AuthTypeEnum) {
    if (type == this.authTypeEnum.login) {
      this.loginMobileNumberValid = data.valid;
      if (data.valid) {
        this.loginFC.formattedPhoneNumber.patchValue(data.pn);
      } else {
        this.loginFC.formattedPhoneNumber.patchValue(null);
      }
    } else if (type == this.authTypeEnum.register) {
      this.mobileNumberValid = data.valid;
      if (data.valid) {
        this.registerFC.formattedPhoneNumber.patchValue(data.pn);
      } else {
        this.registerFC.formattedPhoneNumber.patchValue(null);
      }
    } else if (type == this.authTypeEnum.otpLogin) {
      this.otpLoginMobileNumberValid = data.valid;
      if (data.valid) {
        this.otpLoginFC.formattedPhoneNumber.patchValue(data.pn);
      } else {
        this.otpLoginFC.formattedPhoneNumber.patchValue(null);
      }
    }
  }

  async requestOtp() {
    if (this.registerFC.phoneNumber.valid) {
      this.loading.set(true);
      const res = await this.authService.requestOtp(this.registerFC.formattedPhoneNumber.value || '')
      this.loading.set(false);
      if (res && res.isSuccessful) {
        this.registerStep = this.registerSteps.VerifyOTP;
      } else {
        this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
      }
    }
  }

  async validateOtp() {
    if (this.otp?.length) {
      this.loading.set(true);
      const res = await this.authService.validateOtp(this.registerForm.controls.formattedPhoneNumber.value || '', this.otp);
      this.loading.set(false);
      if (res && res.isSuccessful) {
        this.registerStep = this.registerSteps.CreatePassword;
      } else {
        this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
      }
    }
  }

  async register() {
    const formValues = this.registerForm.value;
    this.loading.set(true);
    const res = await this.authService.register({
      FirstName: formValues.firstName,
      LastName: formValues.lastName,
      Password: formValues.password,
      PhoneNumber: formValues.formattedPhoneNumber,
      Role: ApplicationRoleEnum.Driver
    });
    this.loading.set(false);
    if (res && res.isSuccessful) {
      this.markCompleted(res.response);
    } else {
      this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
    }
  }

  async loginWithOtp() {
    if (this.otpLoginForm.valid) {
      const formValues = this.otpLoginForm.value;
      this.loading.set(true);
      const res = await this.authService.OtpLogin({
        PhoneNumber: formValues.formattedPhoneNumber
      });
      this.loading.set(false);
      if (res && res.isSuccessful) {
        this.otpLoginStep = this.optLoginSteps.VerifyOTP;
      } else {
        this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
      }
    }
  }

  async validateLoginOtp() {
    if (this.loginOtp?.length) {
      this.loading.set(true);
      const res = await this.authService.validateLoginOtp(this.otpLoginForm.controls.formattedPhoneNumber.value || '', this.loginOtp);
      this.loading.set(false);
      if (res && res.isSuccessful) {
        this.markCompleted(res.response)
      } else {
        this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
      }
    }
  }

  async login() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      this.loading.set(true);
      const res = await this.authService.login({
        Password: formValues.password,
        PhoneNumber: formValues.formattedPhoneNumber
      });
      this.loading.set(false);
      if (res && res.isSuccessful) {
        this.markCompleted(res.response)
      } else {
        this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
      }
    }
  }

  async googleSignIn(response: any) {
    this.cdr.detectChanges();
    if (response?.credential) {
      this.loading.set(true);
      const res = await this.authService.googleSignIn(response.credential);
      this.loading.set(false);
      if (res && res.isSuccessful) {
        this.markCompleted(res.response)
      } else {
        this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
      }
    }
  }

  private markCompleted(token: string) {
    localStorage.setItem('token', token);
    this.completed.set(true);
    this.close.emit();
  }


}
