import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Import services
import { BookingService } from '../../services/booking.service';
import { MessageService } from '../../services/message.service';

// Import child components
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { StepServiceComponent } from '../step-service/step-service.component';
import { StepTimeComponent } from '../step-time/step-time.component';
import { StepSeatComponent } from '../step-seat/step-seat.component';
import { StepDetailsComponent } from '../step-details/step-details.component';
import { StepPaymentComponent } from '../step-payment/step-payment.component';
import { StepConfirmationComponent } from '../step-confirmation/step-confirmation.component';
import { BookingData } from '../../models/booking.model';

@Component({
  selector: 'app-booking-wizard',
  templateUrl: './booking-wizard.component.html',
  // Optional: Use OnPush for potential performance gains if state changes are always handled via BookingService
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingWizardComponent implements OnInit, OnDestroy {
  currentStep = 1;
  readonly totalSteps = 6;
  currentBookingData: BookingData | null = null;

  private bookingSubscription: Subscription | undefined;

  constructor(
    private bookingService: BookingService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef // Inject if using OnPush or need manual trigger
  ) {}

  ngOnInit(): void {
    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
        this.currentBookingData = data;
        // If booking confirmed externally or by state restoration, jump to last step
        if (data.isConfirmed && this.currentStep !== this.totalSteps) {
           this.currentStep = this.totalSteps;
        }
        this.cdr.markForCheck(); // Trigger change detection if needed
    });
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
  }

  // HostListener to scroll to top on step change might be better handled
  // within nextStep/prevStep if needed, or via a directive.
  // @HostListener('window:scroll')
  // onWindowScroll() { /* Can check if step changed and scroll */ }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        if (this.currentStep === this.totalSteps) {
            // Final step logic (confirmation)
            this.bookingService.confirmBooking(); // Mark as confirmed, trigger side effects (API etc)
        }
        this.scrollToTop();
        this.cdr.markForCheck();
      }
    } else {
        // Validation messages should be handled within step components or shown via messageService
        console.error(`Validation failed for step ${this.currentStep}`);
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollToTop();
      this.cdr.markForCheck();
    }
  }

  validateCurrentStep(): boolean {
      if (!this.currentBookingData) return false;

      switch (this.currentStep) {
          case 1: // Service
              if (!this.currentBookingData.service) {
                  this.messageService.showMessage('Please select a service.', 'error');
                  return false;
              }
              break;
          case 2: // Time
              if (!this.currentBookingData.time) {
                  this.messageService.showMessage('Please select an appointment time.', 'error');
                  return false;
              }
              break;
          case 3: // Seat (Assuming required for now)
              if (!this.currentBookingData.seat) {
                  this.messageService.showMessage('Please select a seat.', 'error');
                  return false;
              }
              break;
          case 4: // Details (Validation handled within StepDetailsComponent via form validity)
              // We assume the button is disabled if form is invalid, but add a check just in case.
               if (!this.currentBookingData.userInfo.name || !this.currentBookingData.userInfo.phone || !this.currentBookingData.userInfo.email) {
                   this.messageService.showMessage('Please fill in all your details correctly.', 'error');
                   return false; // Should be caught by form validation mostly
               }
              break;
           case 5: // Payment (Validation handled within StepPaymentComponent)
                // Similar to details, button should be disabled. Double check key fields.
                if (!this.currentBookingData.paymentDetails.method) {
                    this.messageService.showMessage('Payment details seem incomplete.', 'error');
                    return false;
                }
                // Specific validation depends on method, handled in child component
                break;
          // Step 6 is confirmation, no validation needed to proceed *to* it here
      }
      return true; // Passed validation or not applicable
  }


  startNewBooking(): void {
    this.bookingService.resetBooking();
    this.currentStep = 1;
    this.messageService.showMessage('Ready for a new booking!', 'success');
    this.scrollToTop();
    this.cdr.markForCheck();
  }

  private scrollToTop(): void {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}