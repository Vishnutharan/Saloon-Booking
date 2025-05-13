import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, map, catchError, of } from 'rxjs';
import { BookingService } from '../../Services/booking.service';
import { MessageService } from '../../Services/message.service';
import { DataService } from 'src/app/Services/data.service';

interface Seat {
    id: string;
    isBooked: boolean;
}

@Component({
  selector: 'app-step-seat',
  templateUrl: './step-seat.component.html',
})
export class StepSeatComponent implements OnInit, OnDestroy {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  seats$: Observable<Seat[]> | undefined;
  selectedSeat: string | null = null;
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

    this.loadAvailableSeats();
    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      this.selectedSeat = data.seat;
      if (data.time && this.selectedSeat === null) {
        this.loadAvailableSeats();
      }
    });
  }

  private loadAvailableSeats(): void {
    const currentData = this.bookingService.getCurrentBookingData();
    if (!currentData.time) {
      this.messageService.showError('Please select a time slot first');
      return;
    }

    this.seats$ = this.bookingService.getAvailableSeats(currentData.time).pipe(
      map(seatIds => seatIds.map(id => ({
        id: id,
        isBooked: false // Available seats are already filtered by the backend
      }))),
      catchError(error => {
        this.messageService.showError('Failed to load available seats');
        console.error('Error loading seats:', error);
        return of([]);
      })
    );
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
    this.messageSubscription?.unsubscribe();
  }

  selectSeat(seat: Seat): void {
    if (seat.isBooked) return;
    this.bookingService.selectSeat(seat.id);
    this.messageService.clearMessage();
  }

  proceed(): void {
    if (!this.selectedSeat) {
      this.messageService.showError('Please select a seat');
      return;
    }
    this.next.emit();
  }

  goBack(): void {
    this.previous.emit();
  }
}
