export interface BookingInterface {
  booking: ChargeBookingInfo;
  bookingCharge: ChargeBookingInfoCharge;
  priceRule: PricingDTO;
}

export interface ChargeBookingInfo {
  id_booking?: string;
  transferred?: any;
  bid?: number;
  invoiced?: any;
  id_company?: string;
  id_recurring_booking?: any;
  id_booking_charge?: number;
  id_price_rule?: string;
  id_payment?: number;
  id_driver_to_car?: any;
  id_driver?: any;
  id_client?: string;
  id_car_type?: string;
  id_car?: any;
  id_web_booker?: any;
  id_ref?: any;
  id_pickup_zone?: number;
  id_dropoff_zone?: number;
  id_voucher?: any;
  id_user?: number;
  id_shuttle?: any;
  id_service?: string;
  id_secondary_drivers_group?: any;
  id_booking_com?: any;
  external_reference?: any;
  allocated_drivers?: any;
  order_number?: string;
  client_name?: string;
  client_email?: string;
  client_mobile?: string;
  booking_type?: number;
  source?: string;
  status?: string;
  payment_method?: string;
  first_booking_note?: any;
  payment_status?: any;
  driver_notes?: any;
  cancel_reason?: number;
  send_to_driver_account?: number;
  flight_type?: any;
  landing_flight_time?: any;
  landing_flight_number?: any;
  airline_name?: any;
  departure_city?: any;
  pickup_duration_delay?: number;
  waiting_time?: number;
  display_name?: any;
  pickup_time?: string;
  dropoff_time?: any;
  pickup_address?: string;
  dropoff_address?: string;
  journey_waypoints?: any;
  legs?: any;
  pickup_details?: string;
  dropoff_details?: string;
  passenger_name?: string;
  passenger_email?: string;
  passenger_mobile?: string;
  passengers_number?: number;
  checkin_luggage?: number;
  hand_luggage?: number;
  infant_seats_number?: number;
  child_seats_number?: number;
  booster_seats_number?: number;
  wheelchair?: number;
  journey_type?: string;
  journey_distance?: number;
  journey_distance_without_via?: any;
  duration?: number;
  pickup_lat?: string;
  pickup_lng?: string;
  dropoff_lat?: string;
  dropoff_lng?: string;
  price_type?: string;
  price_rule_type?: string;
  optional_details?: any;
  weight?: number;
  created_at?: string;
  updated_at?: string;
  airport_code?: any;
  has_delays?: number;
  has_driver_invoice?: number;
  conflict_booking?: any;
  enable_automatic_dispatch?: number;
  passenger_ready?: any;
  document_uploaded?: number;
  car_share?: number;
  has_notes?: number;
  extra_field?: string;
  extra_field2?: any;
  extra_field3?: any;
  extra_field4?: any;
  extra_field5?: any;
  extra_field6?: any;
  extra_field7?: any;
  driver_first_name?: any;
  driver_last_name?: any;
  car_type?: string;
}

export interface ChargeBookingInfoCharge {
  id_booking_charge?: number;
  extra_card_payment?: number;
  base_journey_charge?: number;
  driver_base_journey_charge?: number;
  partner_price?: number;
  extra_baby_seat?: number;
  extra_stow?: number;
  duration_charge?: number;
  extra_waiting_time?: number;
  extra_car_type?: number;
  exception?: number;
  time_frame?: number;
  cash?: number;
  credit?: number;
  commission?: number;
  discount?: number;
  driver_tip?: number;
  total_journey?: number;
  parking?: number;
  authorized_amount?: number;
  driver_total_journey?: number;
  zone_extra_charge?: number;
  voucher_discount?: number;
  administration_fee?: number;
  vat?: number;
  driver_charges_1?: number;
  driver_charges_2?: number;
  driver_earnings?: number;
  override_driver_earnings?: number;
  company_earnings?: number;
  pay_to_driver?: number;
  pay_to_company?: number;
  company_report_income?: number;
  company_report_income_vat?: number;
  company_report_vat?: number;
  percent_driver_total?: number;
  shuttle_extra_checkin_luggage?: number;
  shuttle_extra_hand_luggage?: number;
  shuttle_discount_child?: number;
  shuttle_discount_return?: number;
  payment_method_discount?: number;
  charge1?: number;
  charge2?: number;
  charge3?: number;
  charge4?: number;
  charge5?: number;
  charge6?: number;
  charge7?: number;
  charge8?: number;
  charge9?: number;
  charge10?: number;
  custom_charges_vat?: number;
  charge1_vat?: number;
  charge2_vat?: number;
  charge3_vat?: number;
  charge4_vat?: number;
  charge5_vat?: number;
  charge6_vat?: number;
  charge7_vat?: number;
  charge8_vat?: number;
  charge9_vat?: number;
  charge10_vat?: number;
  share_saving?: number;
}


export interface PricingDTO {
  id: number;
  name: string;
  priceRuleId: string;
  carId: string;
  serviceId: string;
  carName: string;
  carLogoUrl: string;
  noOfPassenger: number;
  noOfSmallLuggage: number;
  noOfLargeLuggage: number;
  timeFrames: PricingTimeFrameDTO[];
  tiers: PricingTierDTO[];
  zones: PricingZoneExtraDTO[];
  fare: number;
  baseFare: number;
  extraAmount?: number;
  tfExtra?: number;
  zoneExtra?: number;
  fareBeforeDisc?: number;
  discountedValue?: number;
}

export interface PricingTimeFrameDTO {
  id: number;
  name: string;
  extra: number;
  startTime: string;
  endTime: string;
  days: string;
}

export interface PricingTierDTO {
  id: number;
  start: number;
  end: number;
  fare: number;
  star: number;
}

export interface PricingZoneExtraDTO {
  id: number;
  extra: number;
  zoneCoordinates: ZoneDTO[]
}

export interface ZoneDTO {
  id: number;
  name: string;
  coordinates: ZoneCoordinatesDTO[]
}

export interface ZoneCoordinatesDTO {
  lat: number;
  lng: number;
}

export interface ViaPointsDTO {
  type: string;
  address: string;
  lat: string;
  lng: string;
  isNew: boolean;
}
