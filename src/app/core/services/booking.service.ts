import {inject, Injectable} from "@angular/core";
import {ApiHandlerService} from "./base/api-handler.service";
import {API_ENDPOINT} from "../../shared/app-utilis";
import {lastValueFrom} from "rxjs";
import {PricingTierInterface} from "../../shared/interfaces/pricing-tier.interface";
import {
  PricingTierDTO,
  PricingTimeFrameDTO,
  PricingZoneExtraDTO,
  ViaPointsDTO
} from "../../shared/interfaces/booking.interface";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  http = inject(ApiHandlerService);
  daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  getBookingDetails(id: string) {
    return lastValueFrom(this.http.Get(API_ENDPOINT.bookingDetails + '?id=' + id));
  }

  Update(payload: any) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.updateBooking, payload));
  }

  addWaitingTime(id: string, time: number, waitingPrice: number, newPrice: number, paymentId: string) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.addWaitingTime, {
      Id: id,
      Time: time,
      NewPrice: newPrice,
      WaitingPrice: waitingPrice,
      PaymentId: paymentId
    }));
  }

  changeDropOff(id: string, oldDropOff: string, dropOff: string, dropOffLat: number, dropOffLng: number, newPrice: number, paymentId: string) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.updateDropOff, {
      Id: id,
      DropOff: dropOff,
      DropOffLat: dropOffLat,
      DropOffLng: dropOffLng,
      NewPrice: newPrice,
      OldDropOff: oldDropOff,
      PaymentId: paymentId
    }));
  }

  addVia(id: string, viaPoints: ViaPointsDTO[], newPrice: number, paymentId: string) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.addVia, {
      Id: id,
      ViaPoints: viaPoints,
      NewPrice: newPrice,
      PaymentId: paymentId
    }));
  }

  generatePaymentLink(syncId: string, id: string, amt: string, action: string, name: string, phoneNumber: string) {
    return lastValueFrom(this.http.Post(API_ENDPOINT.generatePaymentLink, {
      Id: id,
      Amt: amt,
      Action: action,
      Name: name,
      PhoneNumber: phoneNumber,
      SyncId: syncId
    }));
  }

  calculateFare(distanceMiles: string, pricingTires: PricingTierDTO[], timeFrameTires: PricingTimeFrameDTO[], zones: PricingZoneExtraDTO[], pickupDate: Date, extra: number, dropOffLat: number, dropOffLng: number) {
    let fare = this.calculatePrice(parseFloat(distanceMiles), pricingTires);


    const currentDayName = this.daysOfWeek[pickupDate.getDay()];
    const currentHour = pickupDate.getHours();
    const currentMinute = pickupDate.getMinutes();
    let calTfExtra = this.calculateTfExtra(currentDayName, currentHour, currentMinute, timeFrameTires);
    if (calTfExtra) {
      fare = fare + calTfExtra;
    }

    if (zones?.length) {
      const zoneExtra = this.calculateZoneExtra(zones, dropOffLat, dropOffLng);
      if (zoneExtra) {
        fare = fare + zoneExtra;
      }
    }

    if (extra) {
      let amountToAdd = (extra / 100) * fare;
      fare = fare + amountToAdd;
    }
    return fare;
  }

  calculateZoneExtra(zones: PricingZoneExtraDTO[], lat: number, lng: number) {
    let zonePolygons: any[] = [];
    let extra = 0;
    (zones || []).forEach(x => {
      if (x.zoneCoordinates?.length) {
        x.zoneCoordinates.forEach(z => {
          if (z.coordinates?.length) {
            const zoneCoords = z.coordinates.map(c => ({lat: c.lat, lng: c.lng}));
            const polygon = new google.maps.Polygon({
              paths: zoneCoords
            });
            zonePolygons.push({polygon, extra: x.extra});
          }
        });
      }
    });
    const dropOffLocation = new google.maps.LatLng(lat, lng);
    const inZone = zonePolygons.filter(x => google.maps.geometry.poly.containsLocation(dropOffLocation, x.polygon));
    if (inZone?.length) {
      inZone.forEach(z => {
        extra += (z.extra || 0);
      });
    }
    return extra;
  }

  private calculatePrice(distance: number, mileRanges: PricingTierInterface[]) {
    let totalFare = Number(mileRanges[0].star);

    for (let i = 0; i < mileRanges.length; i++) {
      const range = mileRanges[i];
      if (distance <= 0) {
        break;
      } else if (distance <= (range.end - range.start)) {
        totalFare += distance * range.fare;
        break;
      } else {
        totalFare += (range.end - range.start) * range.fare;
        distance -= (range.end - range.start);
      }
    }
    return totalFare;
  }

  private calculateTfExtra(currentDay: string, currentHour: number, currentMinute: number, timeRanges: PricingTimeFrameDTO[]) {
    const matchingTimeRange = timeRanges.find(range => {
      const days = range.days.split(',');
      const isMatchingDay = days.includes(currentDay);
      if (!isMatchingDay) return false;

      const startTime = range.startTime.split(':').map(Number);
      const endTime = range.endTime.split(':').map(Number);

      // Check if the current time is within the range
      return (
        currentHour > startTime[0] || (currentHour === startTime[0] && currentMinute >= startTime[1])
      ) && (
        currentHour < endTime[0] || (currentHour === endTime[0] && currentMinute < endTime[1])
      );
    });

    return matchingTimeRange ? matchingTimeRange.extra : 0;
  }
}
