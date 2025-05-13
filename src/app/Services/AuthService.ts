import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../Environment/environment';

export interface User {
  userId: number;
  email: string;
  name: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}${environment.endpoints.auth}`;
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(user => {
          if (user?.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
          }
          throw new Error('Invalid response from server');
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Login error:', error);
          if (error.status === 401) {
            return throwError(() => 'Invalid email or password');
          }
          return throwError(() => error.error?.message || 'An error occurred during login');
        })
      );
  }

  register(registerData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, registerData)
      .pipe(
        map(user => {
          if (user?.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
          }
          throw new Error('Invalid response from server');
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Registration error:', error);
          if (error.status === 409) {
            return throwError(() => 'Email already exists');
          }
          return throwError(() => error.error?.message || 'An error occurred during registration');
        })
      );
  }

  loginWithGoogle() {
    // Redirect to backend Google authentication endpoint
    window.location.href = `${this.apiUrl}/google`;
  }

  handleGoogleCallback(token: string) {
    // Store the token from Google authentication
    const user = this.decodeToken(token);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private decodeToken(token: string): User | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      return {
        userId: payload.sub,
        email: payload.email,
        name: payload.name,
        token: token
      };
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
