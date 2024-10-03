import {environment} from "../../environments/environment";

export const API_ENDPOINT = {
  bookingDetails: environment.apiUrl + 'api/drivers/booking-details/',
  updateBooking: environment.apiUrl + 'api/drivers/update/',
  addWaitingTime: environment.apiUrl + 'api/drivers/add-waiting-time/',
  updateDropOff: environment.apiUrl + 'api/drivers/update-drop-off/',
  addVia: environment.apiUrl + 'api/drivers/add-via/',
  generatePaymentLink: environment.apiUrl + 'api/drivers/create-payment-link/',
  requestOtp: environment.apiUrl + 'api/auth/request-otp',
  validateOtp: environment.apiUrl + 'api/auth/verify-otp',
  register: environment.apiUrl + 'api/auth/register',
  login: environment.apiUrl + 'api/auth/login',
  googleSignIn: environment.apiUrl + 'api/auth/google-signin',
  loginOtp: environment.apiUrl + 'api/auth/login-otp',
  update: environment.apiUrl + 'api/auth/update',
  verifyLoginOtp: environment.apiUrl + 'api/auth/verify-login-otp',
  booking: environment.apiUrl + 'api/booking/',
  bookingInfo: environment.apiUrl + 'api/booking/info',
  voucher: environment.apiUrl + 'api/booking/voucher',
  createPI: environment.apiUrl + 'api/booking/createPI',
  trips: environment.apiUrl + 'api/booking/trips',
  terminalPayment: environment.apiUrl + 'api/booking/terminalPayment',
  simulateTestTerminalPayment: environment.apiUrl + 'api/booking/simulateTestTerminalPayment',
  addBooking: environment.apiUrl + 'api/booking/add',
  userVouchers: environment.apiUrl + 'api/booking/user-vouchers',
  paymentMethod: {
    attach: environment.apiUrl + 'api/user/attach-wallet',
    detach: environment.apiUrl + 'api/user/detach-wallet',
    list: environment.apiUrl + 'api/user/wallets',
    setDefault: environment.apiUrl + 'api/user/set-default-wallet'
  }
}

export const AppConstant = {
  regularExpressions: {
    space: /(?!^ +$)^.+$/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  defaultASAPMinutes: 15,
  defaultMinuteStep: 5,
  map: {
    plymouthCoordsSW: { // Southwest corner of Plymouth
      lat: 50.3658,
      lng: -4.1425
    },
    plymouthCoordsNE: { // Northeast corner of Plymouth
      lat: 50.4154,
      lng: -4.0546
    },
    zoom: 16,
    country: 'GB'
  },
  dateTimeFormats: {
    fullDateTime: 'dddd, DD MMMM YYYY | HH:mm', //Friday, 07 June 2024 | 16:17,
    date: 'DD MMMM YYYY',
    calendarDate: 'dd/mm/yy',
    time24hr: 'HH:mm'
  }
}

export const stripeDefaultOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
}
