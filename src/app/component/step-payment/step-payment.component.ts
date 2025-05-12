import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { BookingData, PaymentDetails } from '../../models/booking.model';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-step-payment',
  templateUrl: './step-payment.component.html',
})
export class StepPaymentComponent implements OnInit, OnDestroy {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  paymentForm: FormGroup;
  bookingData: BookingData | null = null;
  showCreditCardDetails = false;
  formErrorMessage = '';

  private bookingSubscription: Subscription | undefined;
  private paymentMethodSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private messageService: MessageService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['creditCard', Validators.required], // Default to credit card
      cardNumber: [''],
      cardExpiry: [''],
      cardCVC: ['']
    });
  }

  ngOnInit(): void {
    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      this.bookingData = data;
      // Set initial payment method if needed or patch existing
      if (data.paymentDetails?.method) {
         this.paymentForm.patchValue({ paymentMethod: data.paymentDetails.method });
      } else {
         this.paymentForm.patchValue({ paymentMethod: 'creditCard' }); // Default if not set
      }

      // Update amount in booking service based on selected service
      if (data.service) {
          const currentPaymentDetails = this.bookingService.getCurrentBookingData().paymentDetails;
          this.bookingService.updatePaymentDetails({...currentPaymentDetails, amount: data.service.price });
      }
    });

    this.paymentMethodSubscription = this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      this.updateValidators(value);
      this.showCreditCardDetails = (value === 'creditCard');
      this.formErrorMessage = ''; // Clear general form error on method change
    });

    // Initial validator setup
    this.updateValidators(this.paymentForm.get('paymentMethod')?.value);
    this.showCreditCardDetails = (this.paymentForm.get('paymentMethod')?.value === 'creditCard');
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
    this.paymentMethodSubscription?.unsubscribe();
  }

  updateValidators(paymentMethod: string): void {
    const cardNumberControl = this.paymentForm.get('cardNumber');
    const cardExpiryControl = this.paymentForm.get('cardExpiry');
    const cardCVCControl = this.paymentForm.get('cardCVC');

    if (paymentMethod === 'creditCard') {
      cardNumberControl?.setValidators([Validators.required, Validators.pattern(/^\d{13,16}$/)]);
      cardExpiryControl?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]);
      cardCVCControl?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else {
      cardNumberControl?.clearValidators();
      cardExpiryControl?.clearValidators();
      cardCVCControl?.clearValidators();
    }
    cardNumberControl?.updateValueAndValidity();
    cardExpiryControl?.updateValueAndValidity();
    cardCVCControl?.updateValueAndValidity();
  }

  // Form control getters
  get paymentMethod() { return this.paymentForm.get('paymentMethod'); }
  get cardNumber() { return this.paymentForm.get('cardNumber'); }
  get cardExpiry() { return this.paymentForm.get('cardExpiry'); }
  get cardCVC() { return this.paymentForm.get('cardCVC'); }

   getSlotEndTime(startTime: string | null): string {
    if (!startTime) return '';
    const hour = parseInt(startTime.split(':')[0]);
    return `${String(hour + 1).padStart(2, '0')}:00`;
   }


  proceed(): void {
    this.formErrorMessage = ''; // Clear previous error
    if (this.paymentForm.invalid) {
       this.paymentForm.markAllAsTouched();
       this.formErrorMessage = 'Please correct the errors in the form.';
       if(this.showCreditCardDetails) {
           this.formErrorMessage = 'Please correct the errors in card details.';
       }
       this.messageService.showMessage('Please check payment details.', 'error');
       return;
    }

    const paymentData: PaymentDetails = {
      method: this.paymentMethod?.value,
      amount: this.bookingData?.service?.price ?? 0,
      cardNumber: this.cardNumber?.value,
      cardExpiry: this.cardExpiry?.value,
      cardCVC: this.cardCVC?.value
    };
    this.bookingService.updatePaymentDetails(paymentData);

    // Simulate payment processing
    console.log('Processing payment (mock)...', paymentData);
    this.messageService.showMessage('Payment processed successfully (Mock)!', 'success');

    // In a real app, wait for API response before proceeding
    this.next.emit();
  }

  goBack(): void {
    this.previous.emit();
  }
}