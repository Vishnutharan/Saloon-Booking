import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface AppMessage {
  text: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new Subject<AppMessage | null>();
  message$: Observable<AppMessage | null> = this.messageSubject.asObservable();

  showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    this.messageSubject.next({ text, type });
  }

  showError(text: string): void {
    this.showMessage(text, 'error');
  }

  showSuccess(text: string): void {
    this.showMessage(text, 'success');
  }

  clearMessage(): void {
    this.messageSubject.next(null);
  }
}
