import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {MessageService} from "primeng/api";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {FormsModule} from "@angular/forms";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {SidebarModule} from "primeng/sidebar";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {lastValueFrom} from "rxjs";
import {MapDirectionsService} from "@angular/google-maps";
import {ToolbarModule} from "primeng/toolbar";
import {MenuModule} from "primeng/menu";
import {BookingService} from "../../core/services/booking.service";
import {AuthService} from "../../core/services/auth.service";
import {SignalRService} from "../../core/services/signalr-service";
import {BookingInterface, ViaPointsDTO} from "../../shared/interfaces/booking.interface";
import {GoogleAddressAutoCompleteDirective} from "../../shared/directives/google-address-auto-complete.directive";
import {UpdateBookingActionsEnum} from "../../shared/enums/update-booking-actions.enum";

declare var google: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, CardModule, DividerModule, FormsModule, InputGroupModule, InputTextModule, CalendarModule, GoogleAddressAutoCompleteDirective, InputNumberModule, SidebarModule, ProgressSpinnerModule, ToolbarModule, MenuModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  perMinute = 0.3;
  bookingService = inject(BookingService);
  messageService = inject(MessageService);
  authService = inject(AuthService);
  signalRService = inject(SignalRService);
  route = inject(ActivatedRoute);
  mapDirectionsService = inject(MapDirectionsService);
  router = inject(Router);
  bookingId: string = '';
  loading = false;
  bookingInfo!: BookingInterface;
  bookingMessage = '';
  addWaiting = false;
  waitingTime: number;
  changeDropOff = false;
  dropOff: string;
  dropOffLat: number;
  dropOffLng: number;
  addVia = false;
  newViaPoints: ViaPointsDTO[] = [];
  showWaitingPopup = false;
  priceDiff = 0;
  newPrice = 0;
  calculating = signal(false);
  updating = signal(false);
  autoCompleteOpts = {
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(50.3658, -4.1425),
      new google.maps.LatLng(50.4154, -4.0546)
    ), componentRestrictions: {country: 'GB'}
  };
  viaPoints: ViaPointsDTO[] = [];
  menuItems = [{
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: async () => {
      await this.authService.logout();
      await this.router.navigate(['/auth']);
    }
  }];

  get validNewViaPts() {
    return (this.newViaPoints || []).filter(x => x.address);
  }

  get validViaPts() {
    return (this.viaPoints || []).filter(x => x.address);
  }

  get totalViaPts() {
    return this.validViaPts.concat(this.validNewViaPts);
  }

  get waitingTimePrice() {
    return (this.waitingTime || 0) * this.perMinute;
  }

  async ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.hubConnection.on('PaymentReceived', async (action, paymentId) => {
      this.showWaitingPopup = false;
      this.updating.set(true);

      if (action == UpdateBookingActionsEnum.WaitingTime) {
        const res = await this.bookingService.addWaitingTime(this.bookingId, this.waitingTime, this.waitingTimePrice, this.newPrice, paymentId);
        if (res.isSuccessful) {
          await this.reload();
          this.waitingTime = 0;
          this.messageService.add({severity: 'success', summary: 'Waiting time added successfully'});
        } else {
          this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
        }
      } else if (action == UpdateBookingActionsEnum.AddingVia) {
        const res = await this.bookingService.addVia(this.bookingId, this.totalViaPts, this.newPrice, paymentId);
        if (res.isSuccessful) {
          await this.reload();
          this.viaPoints = [];
          this.newViaPoints = [];
          this.messageService.add({severity: 'success', summary: 'Via point added successfully'});
        } else {
          this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
        }
      } else if (action == UpdateBookingActionsEnum.ChangeDropOff) {
        const res = await this.bookingService.changeDropOff(this.bookingId, this.bookingInfo.booking.dropoff_address || '', this.dropOff, this.dropOffLat, this.dropOffLng, this.newPrice, paymentId);
        if (res.isSuccessful) {
          await this.reload();
          this.dropOff = '';
          this.dropOffLng = 0;
          this.dropOffLat = 0;
          this.messageService.add({severity: 'success', summary: 'Drop off updated successfully'});
        } else {
          this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
        }
      }

      this.updating.set(false);
    });

    const id = this.route.snapshot.queryParamMap.get('id') || '';
    if (id?.length) {
      this.bookingId = id;
      await this.reload();
    }
  }

  async searchBooking() {
    if (this.bookingId?.length) {
      this.loading = true;
      const res = await this.bookingService.getBookingDetails(this.bookingId);
      this.loading = false;
      if (res.isSuccessful) {
        this.bookingMessage = '';
        this.bookingInfo = res.response as BookingInterface;
        this.viaPoints = this.bookingInfo.booking.journey_waypoints?.length ? JSON.parse(this.bookingInfo.booking.journey_waypoints) : [];
      } else {
        this.bookingMessage = 'No booking found';
      }
    }
  }

  onAddressInput(data: any, type: 'd' | 'v', index: number) {
    if (type == 'd') {
      this.dropOff = '';
      this.dropOffLat = 0;
      this.dropOffLng = 0;
    }
    if (type == 'v') {
      let viaPt = this.newViaPoints[index];
      if (viaPt) {
        viaPt.address = '';
        viaPt.lat = '';
        viaPt.lng = '';
      }
    }
  }

  addMoreVia() {
    this.newViaPoints.push({
      isNew: true,
      lat: '',
      lng: '',
      type: 'w',
      address: ''
    });
  }

  async removeVia(index: number) {
    this.newViaPoints.splice(index, 1);
    if (this.validNewViaPts.length) {
      await this.calculatePrice();
    }
  }

  async onAddressChange(place: any, type: 'd' | 'v', index: number) {
    this.updating.set(true);
    this.calculating.set(true);

    const data = {
      address: this.formatAddress(place),
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    if (type == 'd') {
      this.dropOff = data.address;
      this.dropOffLat = data.lat;
      this.dropOffLng = data.lng;
    }

    if (type == 'v') {
      let viaPt = this.newViaPoints[index];
      if (viaPt) {
        viaPt.address = data.address;
        viaPt.lat = data.lat;
        viaPt.lng = data.lng;
      }
    }

    await this.calculatePrice();
  }

  async addWaitingTime() {
    if (!this.waitingTime || this.waitingTime <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Please type valid waiting time'
      });
      return;
    }

    this.priceDiff = this.waitingTimePrice;
    this.newPrice = this.priceDiff + (this.bookingInfo.bookingCharge.total_journey || 0);
    await this.generatePaymentLink('Waiting Time', UpdateBookingActionsEnum.WaitingTime);
  }

  async changeDropOffAddress() {
    if (this.dropOff?.length && this.dropOffLat != 0 && this.dropOffLng != 0) {
      await this.generatePaymentLink('Changing drop off address', UpdateBookingActionsEnum.ChangeDropOff);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid drop off location. Please select a drop off point from the dropdown list'
      });
    }
  }

  async addViaAddress() {
    if (this.validNewViaPts.length) {
      await this.generatePaymentLink('Via Point', UpdateBookingActionsEnum.AddingVia);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid via location. Please select a via point from the dropdown list'
      });
    }
  }

  enableAddVia() {
    this.addWaiting = false;
    this.changeDropOff = false;
    this.addVia = true;
    this.newPrice = 0;
    this.priceDiff = 0;
    this.newViaPoints = [];
    this.addMoreVia();
  }

  enableAddWaiting() {
    this.addWaiting = true;
    this.changeDropOff = false;
    this.addVia = false;
    this.newPrice = 0;
    this.priceDiff = 0;
    this.newViaPoints = [];
  }

  enableChangeDropOff() {
    this.addWaiting = false;
    this.changeDropOff = true;
    this.addVia = false;
    this.newPrice = 0;
    this.priceDiff = 0;
    this.newViaPoints = [];
  }

  async reload() {
    this.addWaiting = false;
    this.changeDropOff = false;
    this.addVia = false;
    this.newPrice = 0;
    this.priceDiff = 0;
    await this.searchBooking();
  }

  private async calculatePrice() {
    const pickupLat = parseFloat(this.bookingInfo.booking.pickup_lat || '');
    const pickupLng = parseFloat(this.bookingInfo.booking.pickup_lng || '');
    const dropOffLat = this.dropOffLat || parseFloat(this.bookingInfo.booking.dropoff_lat || '');
    const dropOffLng = this.dropOffLng || parseFloat(this.bookingInfo.booking.dropoff_lng || '');
    const dirInfo = await this.getDirections(pickupLat, pickupLng, dropOffLat, dropOffLng, this.totalViaPts);
    const fare = this.bookingService.calculateFare(dirInfo.distanceMiles, this.bookingInfo.priceRule.tiers, this.bookingInfo.priceRule.timeFrames, this.bookingInfo.priceRule.zones, new Date(this.bookingInfo.booking.pickup_time || ''), this.dropOffLat, this.dropOffLng) || 0;
    this.newPrice = fare + (this.bookingInfo.bookingCharge.extra_waiting_time || 0);
    this.priceDiff = this.newPrice - (this.bookingInfo.bookingCharge.total_journey || 0);
    this.updating.set(false);
    this.calculating.set(false);
  }

  private formatAddress(place: any) {
    return place?.name?.length && !(place.formatted_address || '').includes(place.name) ? `${(place.name || '')}, ${place.formatted_address}` : `${place.formatted_address}`
  }

  private async generatePaymentLink(readableAction: string, action: string) {
    if (this.priceDiff > 0) {
      const phoneNumber = this.bookingInfo.booking.passenger_mobile || '';
      if (phoneNumber.length == 0) {
        this.messageService.add({severity: 'error', summary: 'No passenger phone number found'});
        return;
      }

      this.updating.set(true);
      const res = await this.bookingService.generatePaymentLink(this.priceDiff.toFixed(1), this.bookingId, readableAction, action, this.bookingInfo.booking.passenger_name || '', this.bookingInfo.booking.passenger_mobile || '');
      this.updating.set(false);
      if (res.isSuccessful) {
        this.showWaitingPopup = true;
      } else {
        this.messageService.add({severity: 'error', summary: res.response || 'Something went wrong'});
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Cannot process the negative price request.'
      });
    }
  }

  private async getDirections(pickupLat: number, pickupLng: number, dropOffLat: number, dropOffLng: number, viaPoints: ViaPointsDTO[]) {

    const waypoints: google.maps.DirectionsWaypoint[] = viaPoints?.length ? (viaPoints).map((w) => ({
      location: new google.maps.LatLng(w.lat, w.lng),
      stopover: true
    })) : [];

    const response = await lastValueFrom(this.mapDirectionsService.route({
      destination: new google.maps.LatLng(dropOffLat, dropOffLng),
      origin: new google.maps.LatLng(pickupLat, pickupLng),
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }));

    let totalDuration = 0;
    let totalDistance = 0;
    let totalMiles = 0;

    if (response && response?.result?.routes[0]?.legs?.length) {
      response.result.routes[0].legs.forEach((r) => {
        if (r.duration) {
          totalDuration += r.duration.value;
        }

        if (r.distance) {
          totalDistance += r.distance.value;

          if (r.distance.text.includes('ft')) {
            totalMiles += parseFloat(this.feetToMiles(parseFloat(r.distance.text)).toFixed(2));
          } else if (r.distance.text.includes('mi')) {
            totalMiles += parseFloat(r.distance.text);
          }
        }
      });

      return {
        totalDuration,
        totalDistance,
        distanceMiles: totalMiles + ' mi',
      };
    } else {
      return {
        totalDuration,
        totalDistance,
        distanceMiles: totalMiles + ' mi',
      };
    }
  }

  private feetToMiles(feet: number) {
    const feetPerMile = 5280;
    return feet / feetPerMile;
  }
}
