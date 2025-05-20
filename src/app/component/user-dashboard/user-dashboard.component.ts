import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../Services/booking.service';
import { BookingData } from '../../models/booking.model';
import { AuthService } from '../../Services/AuthService';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  bookings: BookingData[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.userId) {
      this.fetchUserBookings(currentUser.userId.toString());
    } else {
      this.errorMessage = 'User not logged in.';
      this.loading = false;
    }
  }

  fetchUserBookings(userId: string): void {
    this.bookingService.getUserBookings(userId).subscribe({
      next: (data: BookingData[]) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load bookings.';
        this.loading = false;
      }
    });
  }

  makePayment(booking: BookingData): void {
    // Placeholder for payment logic, e.g., navigate to payment step or open payment modal
    alert(`Initiate payment for booking of service: ${booking.service?.name}`);
  }
}
