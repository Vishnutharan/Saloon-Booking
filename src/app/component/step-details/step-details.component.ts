import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookingService } from '../../Services/booking.service';
import { UserInfo } from '../../Models/booking.model';

@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.component.html',
})
export class StepDetailsComponent implements OnInit, OnDestroy {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  userInfoForm: FormGroup;
  private bookingSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.userInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-?\d{3}-?\d{4}$/)]], // US-like format
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      // Patch form only if data exists and form is pristine or needs update
      if (data.userInfo && (this.userInfoForm.pristine || this.formValuesDiffer(data.userInfo))) {
         this.userInfoForm.patchValue(data.userInfo);
      }
    });
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
  }

  // Helper to prevent unnecessary patching if navigating back and forth
  private formValuesDiffer(userInfo: UserInfo): boolean {
      return this.userInfoForm.value.name !== userInfo.name ||
             this.userInfoForm.value.phone !== userInfo.phone ||
             this.userInfoForm.value.email !== userInfo.email;
  }

   // Form control getters for easier template access
  get name() { return this.userInfoForm.get('name'); }
  get phone() { return this.userInfoForm.get('phone'); }
  get email() { return this.userInfoForm.get('email'); }

  proceed(): void {
    if (this.userInfoForm.invalid) {
      this.userInfoForm.markAllAsTouched(); // Show validation errors
      return;
    }
    this.bookingService.updateUserInfo(this.userInfoForm.value);
    this.next.emit();
  }

  goBack(): void {
    // Optionally save draft if form is valid but user goes back?
    // if (this.userInfoForm.valid) {
    //    this.bookingService.updateUserInfo(this.userInfoForm.value);
    // }
    this.previous.emit();
  }
}
