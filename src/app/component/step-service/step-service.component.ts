import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Service } from '../../models/service.model';
import { BookingData } from '../../models/booking.model';
import { DataService } from '../../services/data.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-step-service',
  templateUrl: './step-service.component.html',
})
export class StepServiceComponent implements OnInit, OnDestroy {
  @Output() next = new EventEmitter<void>();

  services$: Observable<Service[]> | undefined;
  selectedService: Service | null = null;
  errorMessage: string = '';

  private bookingSubscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.services$ = this.dataService.getServices();
    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      this.selectedService = data.service;
    });
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
  }

  selectService(service: Service): void {
    this.bookingService.selectService(service);
    this.errorMessage = ''; // Clear error on selection
  }

  proceed(): void {
    if (!this.selectedService) {
      this.errorMessage = 'Please select a service.';
      return;
    }
    this.errorMessage = '';
    this.next.emit();
  }
}