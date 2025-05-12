import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookingData, initialBookingData, PaymentDetails, UserInfo } from '../models/booking.model';
import { Service } from '../models/service.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingState = new BehaviorSubject<BookingData>(this.getClonedInitialData());
  readonly bookingState$: Observable<BookingData> = this.bookingState.asObservable();

  constructor(private dataService: DataService) {}

  private getClonedInitialData(): BookingData {
    // Deep clone to avoid modifying the original constant
    return JSON.parse(JSON.stringify(initialBookingData));
  }

  getCurrentBookingData(): BookingData {
    return this.bookingState.getValue();
  }

  selectService(service: Service | null): void {
    const currentData = this.getCurrentBookingData();
    this.bookingState.next({ ...currentData, service: service });
  }

  selectTime(time: string | null): void {
    const currentData = this.getCurrentBookingData();
    this.bookingState.next({ ...currentData, time: time });
  }

  selectSeat(seat: string | null): void {
    const currentData = this.getCurrentBookingData();
    this.bookingState.next({ ...currentData, seat: seat });
  }

  updateUserInfo(info: UserInfo): void {
    const currentData = this.getCurrentBookingData();
    this.bookingState.next({ ...currentData, userInfo: info });
  }

  updatePaymentDetails(payment: PaymentDetails): void {
    const currentData = this.getCurrentBookingData();
    this.bookingState.next({ ...currentData, paymentDetails: payment });
  }

  confirmBooking(): void {
    const currentData = this.getCurrentBookingData();
    if(currentData.time) {
        this.dataService.confirmBooking(currentData.time, currentData.seat);
    }
    this.bookingState.next({ ...currentData, isConfirmed: true });
    // Here you would typically trigger side effects like sending API request, email etc.
  }

  resetBooking(): void {
    // Potentially reset dynamic data simulation if needed for demo
    // this.dataService.resetBookings(); // Uncomment if you want full reset on new booking start
    this.bookingState.next(this.getClonedInitialData());
  }
}