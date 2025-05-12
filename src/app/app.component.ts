// app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/AuthService';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light" *ngIf="isLoggedIn">
      <div class="container">
        <a class="navbar-brand" href="#">Saloon Booking</a>
        <button class="btn btn-outline-danger" (click)="logout()">Logout</button>
      </div>
    </nav>
    
    <!-- Main content area -->
    <main class="bg-slate-100 flex items-start justify-center min-h-screen p-4 sm:p-6 md:p-8">
      
    </main>

    <router-outlet></router-outlet> <!-- Keep if routing is used elsewhere -->
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'saloon-booking-ng';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
