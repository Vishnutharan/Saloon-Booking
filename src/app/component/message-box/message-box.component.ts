import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageService, AppMessage } from '../../Services/message.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px) translateX(-50%)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0) translateX(-50%)' })),
      transition(':enter', [animate('300ms ease-out')]),
      transition(':leave', [animate('300ms ease-in')])
    ])
  ]
})
export class MessageBoxComponent implements OnInit, OnDestroy {
  message: AppMessage | null = null;
  private messageSubscription: Subscription | undefined;
  private timer: any;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageSubscription = this.messageService.message$.subscribe(msg => {
      this.message = msg;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (msg) {
        this.timer = setTimeout(() => {
          this.message = null;
        }, 3000); // Auto-hide after 3 seconds
      }
    });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  get messageClasses(): string {
    if (!this.message) return '';
    return this.message.type === 'success' ? 'bg-green-500' : 'bg-red-500';
  }
}
