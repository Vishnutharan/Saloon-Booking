import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookingService } from '../../Services/booking.service';
import { MessageService } from '../../Services/message.service';
import { BookingData } from '../../models/booking.model';

@Component({
  selector: 'app-booking-wizard',
  templateUrl: './booking-wizard.component.html',
  styleUrls: ['./booking-wizard.component.css'], // Updated CSS reference
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingWizardComponent implements OnInit, OnDestroy {
  currentStep = 1;
  readonly totalSteps = 6;
  currentBookingData: BookingData | null = null;
  message: { text: string | null; type: 'success' | 'error' | null } = { text: null, type: null };
  private bookingSubscription: Subscription | undefined;

  constructor(
    private bookingService: BookingService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      this.currentBookingData = data;
      if (data.isConfirmed && this.currentStep !== this.totalSteps) {
        this.currentStep = this.totalSteps;
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
  }

  nextStep(): void {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        if (this.currentStep === this.totalSteps - 1) {
          this.bookingService.confirmBooking().subscribe({
            next: () => {
              this.currentStep++;
              this.messageService.showMessage('Booking confirmed successfully!', 'success');
              this.scrollToTop();
              this.cdr.markForCheck();
            },
            error: (errors: string[]) => {
              const errorMessage = Array.isArray(errors) ? errors.join(', ') : 'Failed to confirm booking';
              this.messageService.showMessage(errorMessage, 'error');
            }
          });
        } else {
          this.currentStep++;
          this.scrollToTop();
          this.cdr.markForCheck();
        }
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollToTop();
      this.cdr.markForCheck();
    }
  }

  validateStep(step: number): boolean {
    const validationMessages: Record<number, { condition: boolean; message: string }> = {
      1: { condition: !this.currentBookingData?.service, message: 'Please select a service' },
      2: { condition: !this.currentBookingData?.time, message: 'Please select an appointment time' },
      3: { condition: !this.currentBookingData?.seat, message: 'Please select a seat' },
      4: {
        condition: !this.currentBookingData?.userInfo.name ||
          !this.currentBookingData?.userInfo.phone ||
          !this.currentBookingData?.userInfo.email,
        message: 'Please fill in all your details correctly'
      },
      5: {
        condition: !this.currentBookingData?.paymentDetails.method ||
          this.currentBookingData?.paymentDetails.amount <= 0,
        message: 'Please complete payment details'
      }
    };

    const stepValidation = validationMessages[step];
    if (stepValidation && stepValidation.condition) {
      this.messageService.showMessage(stepValidation.message, 'error');
      return false;
    }
    return true;
  }

  startNewBooking(): void {
    if (this.currentBookingData?.isConfirmed) {
      this.bookingService.resetBooking();
      this.currentStep = 1;
      this.messageService.showMessage('Ready for a new booking!', 'success');
      this.scrollToTop();
      this.cdr.markForCheck();
    } else {
      const confirmReset = window.confirm('Are you sure you want to start a new booking? All current progress will be lost.');
      if (confirmReset) {
        this.bookingService.resetBooking();
        this.currentStep = 1;
        this.messageService.showMessage('Starting a new booking', 'success');
        this.scrollToTop();
        this.cdr.markForCheck();
      }
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
