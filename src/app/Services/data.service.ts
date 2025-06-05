import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Service } from '../Models/service.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private services: Service[] = [
    { id: 1, name: 'Classic Haircut', price: 50, description: 'A timeless haircut tailored to your style, including wash and blow-dry.', duration: '60 mins' },
    { id: 2, name: 'Luxury Manicure', price: 75, description: 'Pamper your hands with our luxury manicure service, including exfoliation and massage.', duration: '45 mins' },
    { id: 3, name: 'Rejuvenating Facial', price: 120, description: 'Revitalize your skin with our signature facial, customized to your skin type.', duration: '75 mins' },
    { id: 4, name: 'Beard Trim & Style', price: 40, description: 'Expert shaping and styling for your beard, finished with nourishing beard oil.', duration: '30 mins' },
    { id: 5, name: 'Hair Coloring', price: 150, description: 'Full head hair coloring with premium products. Consultation included.', duration: '120 mins' }
  ];

  // Simulate dynamic booking changes
  private bookedTimeSlots = ['10:00', '14:00'];
  private bookedSeats = ['S2', 'S5'];
  private totalSeats = 10;

  getServices(): Observable<Service[]> {
    return of(this.services);
  }

  getAvailableTimeSlots(): Observable<string[]> {
    const availableSlots: string[] = [];
    const openingTime = 8;
    const closingTime = 20;
    for (let hour = openingTime; hour < closingTime; hour++) {
        const timeString = `${String(hour).padStart(2, '0')}:00`;
        if (!this.bookedTimeSlots.includes(timeString)) {
            availableSlots.push(timeString);
        }
    }
    return of(availableSlots);
  }

  getAllTimeSlots(): Observable<string[]> {
    const allSlots: string[] = [];
    const openingTime = 8;
    const closingTime = 20;
    for (let hour = openingTime; hour < closingTime; hour++) {
        const timeString = `${String(hour).padStart(2, '0')}:00`;
        allSlots.push(timeString);
    }
    return of(allSlots);
  }

   isTimeSlotBooked(time: string): boolean {
    return this.bookedTimeSlots.includes(time);
  }

  getAvailableSeats(): Observable<string[]> {
     const availableSeats: string[] = [];
     for (let i = 1; i <= this.totalSeats; i++) {
        const seatId = `S${i}`;
        if (!this.bookedSeats.includes(seatId)) {
             availableSeats.push(seatId);
        }
     }
     return of(availableSeats);
  }

  getAllSeats(): Observable<string[]> {
      const allSeats: string[] = [];
      for (let i = 1; i <= this.totalSeats; i++) {
         const seatId = `S${i}`;
         allSeats.push(seatId);
      }
      return of(allSeats);
   }

  isSeatBooked(seat: string): boolean {
    // In real app, this might depend on selected time
    return this.bookedSeats.includes(seat);
  }

  // Call this when a booking is confirmed
  confirmBooking(time: string, seat: string | null): void {
    if (!this.bookedTimeSlots.includes(time)) {
        this.bookedTimeSlots.push(time);
    }
    if (seat && !this.bookedSeats.includes(seat)) {
        this.bookedSeats.push(seat);
    }
    console.log("Updated Booked Times:", this.bookedTimeSlots);
    console.log("Updated Booked Seats:", this.bookedSeats);
  }

  resetBookings(): void {
      // For demo purposes, reset to initial state - a real app wouldn't do this easily
      this.bookedTimeSlots = ['10:00', '14:00'];
      this.bookedSeats = ['S2', 'S5'];
  }
}