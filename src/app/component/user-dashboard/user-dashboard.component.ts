import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  // Sample data to show booking information, can be replaced by real data
  bookings = [
    { service: 'Haircut', date: '2025-05-22', time: '10:00 AM', status: 'Confirmed' },
    { service: 'Facial', date: '2025-05-23', time: '02:00 PM', status: 'Pending' },
    { service: 'Manicure', date: '2025-05-24', time: '01:00 PM', status: 'Cancelled' },
  ];
}
