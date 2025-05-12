import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { BookingData } from '../../models/booking.model';

@Component({
  selector: 'app-step-confirmation',
  templateUrl: './step-confirmation.component.html',
})
export class StepConfirmationComponent implements OnInit, OnDestroy {
  @Output() newBooking = new EventEmitter<void>();

  bookingData: BookingData | null = null;
  private bookingSubscription: Subscription | undefined;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      this.bookingData = data;
    });
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
  }

   getSlotEndTime(startTime: string | null): string {
    if (!startTime) return '';
    const hour = parseInt(startTime.split(':')[0]);
    return `${String(hour + 1).padStart(2, '0')}:00`;
   }

   getPaymentMethodLabel(method: string | undefined): string {
       switch(method) {
           case 'creditCard': return 'Credit Card';
           case 'paypal': return 'PayPal (Mock)';
           case 'cash': return 'Cash at Saloon (Mock)';
           default: return 'N/A';
       }
   }

  startNew(): void {
    this.newBooking.emit();
  }
}