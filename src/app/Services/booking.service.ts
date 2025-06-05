import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BookingData, UserInfo } from '../Models/booking.model';
import { initialBookingData } from '../Models/booking.model';
import { PaymentDetails } from '../Models/booking.model';

import { Service } from '../Models/service.model';
import { environment } from '../Environment/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingState = new BehaviorSubject<BookingData>(this.getClonedInitialData());
  readonly bookingState$: Observable<BookingData> = this.bookingState.asObservable();
  private apiUrl: string;

  constructor(
    private dataService: DataService,
    private http: HttpClient
  ) {
    this.apiUrl = `${environment.apiUrl}${environment.endpoints.booking}`;
  }

  getUserBookings(userId: string): Observable<BookingData[]> {
    return this.http.get<BookingData[]>(`${this.apiUrl}/user/${userId}/bookings`);
  }

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

  validateBookingData(data: BookingData): string[] {
    const errors: string[] = [];
    
    if (!data.service) {
      errors.push('Please select a service');
    }
    if (!data.time) {
      errors.push('Please select an appointment time');
    }
    if (!data.seat) {
      errors.push('Please select a seat');
    }
    if (!data.userInfo.name || !data.userInfo.phone || !data.userInfo.email) {
      errors.push('Please fill in all user information');
    }
    if (!data.paymentDetails.method || data.paymentDetails.amount <= 0) {
      errors.push('Please complete payment details');
    }
    
    return errors;
  }

  confirmBooking(): Observable<BookingData> {
    const currentData = this.getCurrentBookingData();
    const validationErrors = this.validateBookingData(currentData);
    
    if (validationErrors.length > 0) {
      return throwError(() => validationErrors);
    }

    return this.http.post<BookingData>(`${this.apiUrl}/confirm`, currentData)
      .pipe(
        map(response => {
          this.bookingState.next({ ...currentData, isConfirmed: true });
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Booking confirmation error:', error);
          if (error.status === 409) {
            return throwError(() => ['This time slot is no longer available']);
          }
          return throwError(() => [error.error?.message || 'Failed to confirm booking']);
        })
      );
  }

  resetBooking(): void {
    this.dataService.resetBookings();
    this.bookingState.next(this.getClonedInitialData());
  }

  getAvailableTimeSlots(date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/timeslots`, { params: { date } })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching time slots:', error);
          return throwError(() => 'Failed to load available time slots');
        })
      );
  }

  getAvailableSeats(time: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/seats`, { params: { time } })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching seats:', error);
          return throwError(() => 'Failed to load available seats');
        })
      );
  }
}
