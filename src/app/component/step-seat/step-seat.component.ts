import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, map } from 'rxjs';
import { DataService } from '../../services/data.service';
import { BookingService } from '../../services/booking.service';

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
  errorMessage: string = '';

  private bookingSubscription: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.seats$ = this.dataService.getAllSeats().pipe(
        map(seatIds => seatIds.map(id => ({
            id: id,
            isBooked: this.dataService.isSeatBooked(id) // Check booking status
        })))
    );

    this.bookingSubscription = this.bookingService.bookingState$.subscribe(data => {
      this.selectedSeat = data.seat;
    });
  }

  ngOnDestroy(): void {
    this.bookingSubscription?.unsubscribe();
  }

  selectSeat(seat: Seat): void {
    if (seat.isBooked) return;
    this.bookingService.selectSeat(seat.id);
    this.errorMessage = ''; // Clear error on selection
  }

  proceed(): void {
    // Seat selection can be optional? Adjust if required.
    // For now, let's make it required if seats are shown.
    if (!this.selectedSeat) {
       this.errorMessage = 'Please select a seat.';
       return;
    }
    this.errorMessage = '';
    this.next.emit();
  }

  goBack(): void {
    this.previous.emit();
  }
}