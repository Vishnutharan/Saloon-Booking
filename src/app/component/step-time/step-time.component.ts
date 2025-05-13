import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, map, catchError, of } from 'rxjs';
import { DataService } from '../../Services/data.service';
import { BookingService } from '../../Services/booking.service';
import { MessageService } from '../../Services/message.service';

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
  errorMessage: string | null = null;

  private bookingSubscription: Subscription | undefined;
  private messageSubscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private bookingService: BookingService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.messageSubscription = this.messageService.message$.subscribe(message => {
      this.errorMessage = message?.type === 'error' ? message.text : null;
    });

    const today = new Date().toISOString().split('T')[0];
    this.loadTimeSlots(today);

    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      this.selectedTime = data.time;
    });
  }

  loadTimeSlots(date: string): void {
    this.timeSlots$ = this.bookingService.getAvailableTimeSlots(date).pipe(
      map(slots => slots.map(time => ({
        time: time,
        isBooked: false // Available slots are already filtered by the backend
      }))),
      catchError(error => {
        this.messageService.showError('Failed to load available time slots');
        console.error('Error loading time slots:', error);
        return of([]);
      })
    );
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
    this.messageSubscription?.unsubscribe();
  }

  selectTime(slot: TimeSlot): void {
    if (slot.isBooked) return;
    this.bookingService.selectTime(slot.time);
    this.messageService.clearMessage();
  }

  getSlotEndTime(startTime: string): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = (hours + 1) % 24;
    return `${String(endHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  proceed(): void {
    if (!this.selectedTime) {
      this.messageService.showError('Please select an appointment time');
      return;
    }
    this.next.emit();
  }

  goBack(): void {
    this.previous.emit();
  }
}
