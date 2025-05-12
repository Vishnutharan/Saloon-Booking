import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, map } from 'rxjs';
import { DataService } from '../../services/data.service';
import { BookingService } from '../../services/booking.service';

interface TimeSlot {
    time: string;
    isBooked: boolean;
}

@Component({
  selector: 'app-step-time',
  templateUrl: './step-time.component.html',
})
export class StepTimeComponent implements OnInit, OnDestroy {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  timeSlots$: Observable<TimeSlot[]> | undefined;
  selectedTime: string | null = null;
  errorMessage: string = '';

  private bookingSubscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
     this.timeSlots$ = this.dataService.getAllTimeSlots().pipe(
        map(slots => slots.map(time => ({
            time: time,
            isBooked: this.dataService.isTimeSlotBooked(time)
        })))
     );

    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      this.selectedTime = data.time;
    });
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
  }

  selectTime(slot: TimeSlot): void {
    if (slot.isBooked) return;
    this.bookingService.selectTime(slot.time);
    this.errorMessage = ''; // Clear error on selection
  }

   getSlotEndTime(startTime: string): string {
    const hour = parseInt(startTime.split(':')[0]);
    return `${String(hour + 1).padStart(2, '0')}:00`;
   }

  proceed(): void {
    if (!this.selectedTime) {
      this.errorMessage = 'Please select an appointment time.';
      return;
    }
    this.errorMessage = '';
    this.next.emit();
  }

  goBack(): void {
    this.previous.emit();
  }
}