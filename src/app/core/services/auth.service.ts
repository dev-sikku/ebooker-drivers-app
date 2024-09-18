import {Injectable} from "@angular/core";
import {ApiHandlerService} from "./base/api-handler.service";
import {lastValueFrom, Subject} from "rxjs";
import {API_ENDPOINT} from "../../shared/app-utilis";
import {Router} from "@angular/router";
import {UserInterface} from "../../shared/interfaces/user-interface";
import {ApplicationRoleEnum} from "../../shared/enums/application-role.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  onUserLogout$ = new Subject<boolean>();
  userLogoutSubject = this.onUserLogout$.asObservable();

  constructor(private http: ApiHandlerService, private router: Router) {
  }


  requestOtp(phoneNumber: string) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.requestOtp, {
      PhoneNumber: phoneNumber,
    }));
  }

  validateOtp(phoneNumber: string, code: string) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.validateOtp, {
      PhoneNumber: phoneNumber,
      Code: code
    }));
  }

  register(payload: any) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.register, payload));
  }

  login(payload: any) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.login, payload));
  }

  googleSignIn(token: string) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.googleSignIn, {Token: token, Role: ApplicationRoleEnum.Driver}));
  }

  OtpLogin(payload: any) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.loginOtp, payload));
  }

  validateLoginOtp(phoneNumber: string, code: string) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.verifyLoginOtp, {
      PhoneNumber: phoneNumber,
      Code: code
    }));
  }

  update(payload: any) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.update, payload));
  }

  public isAuthenticated(): boolean {
    let accessToken = this.getAccessToken();
    return !!accessToken?.length;
  }

  public getAccessToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUserModal(): UserInterface {
    return this.parseJwt(this.getAccessToken()) as UserInterface;
  }

  async logout() {
    localStorage.removeItem('token');
    this.onUserLogout$.next(true);
  }

  private parseJwt(token: string) {
    if (token?.length) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } else {
      return "";
    }
  }
}
