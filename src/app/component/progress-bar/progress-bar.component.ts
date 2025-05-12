import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProgressStepItem {
    step: number;
    label: string;
    icon?: string; // Optional icon for completed step
}

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'] // Add separate CSS for lines if needed
})
export class ProgressBarComponent {
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 6; // Default or could be derived from steps array

  steps: ProgressStepItem[] = [
    { step: 1, label: 'Service' },
    { step: 2, label: 'Time' },
    { step: 3, label: 'Seat' },
    { step: 4, label: 'Details' },
    { step: 5, label: 'Payment' },
    { step: 6, label: 'Confirm', icon: '✓' }
  ];

   getStepClass(stepItem: ProgressStepItem): string {
    if (stepItem.step < this.currentStep) {
        return 'completed';
    } else if (stepItem.step === this.currentStep) {
        return 'active';
    }
    return '';
   }
}