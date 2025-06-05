import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookingService } from '../../Services/booking.service';
import { BookingData, PaymentDetails } from '../../Models/booking.model';
import { MessageService } from 'src/app/Services/message.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../Environment/environment';

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
  stripe: Stripe | null = null;
  cardElement: StripeCardElement | null = null;

  private bookingSubscription: Subscription | undefined;
  private paymentMethodSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private messageService: MessageService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['creditCard', Validators.required], // Default to credit card
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
    this.initializeStripe();

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
    this.cardElement?.unmount();
  }

  updateValidators(paymentMethod: string): void {
    // Validators handled by Stripe Elements
  }

  private async initializeStripe() {
    this.stripe = await loadStripe(environment.stripePublicKey);
    if (!this.stripe) {
      console.error('Stripe failed to load');
      return;
    }
    const elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
  }

  // Form control getters
  get paymentMethod() { return this.paymentForm.get('paymentMethod'); }

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
    };
    this.bookingService.updatePaymentDetails(paymentData);

    if (!this.stripe || !this.cardElement) {
      this.messageService.showMessage('Payment system not initialized.', 'error');
      return;
    }

    fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: paymentData.amount * 100, currency: 'usd' })
    })
    .then(res => res.json())
    .then(async data => {
      const { error } = await this.stripe!.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: this.cardElement!,
        }
      });
      if (error) {
        this.messageService.showMessage(error.message || 'Payment failed', 'error');
      } else {
        this.messageService.showMessage('Payment successful!', 'success');
        this.next.emit();
      }
    })
    .catch(() => this.messageService.showMessage('Payment error', 'error'));
  }

  goBack(): void {
    this.previous.emit();
  }
}
