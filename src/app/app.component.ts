import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/AuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'saloon-booking-ng';
  scrolled = false;
  showMobileMenu = false;
  showBackToTop = false;

  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
    this.showBackToTop = window.scrollY > 300;
  }

  // Function to toggle mobile menu
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    document.body.style.overflow = this.showMobileMenu ? 'hidden' : '';
  }

  // Function to scroll to the top
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Auth-related functions
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}