import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { SaloonHomeComponent } from './component/saloon-home/saloon-home.component';
import { BookingWizardComponent } from './component/booking-wizard/booking-wizard.component';
import { AuthGuard } from './Guard/AuthGuard';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';
import { StepDetailsComponent } from './component/step-details/step-details.component';
import { MessageBoxComponent } from './component/message-box/message-box.component';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';
import { StepConfirmationComponent } from './component/step-confirmation/step-confirmation.component';
import { StepPaymentComponent } from './component/step-payment/step-payment.component';
import { StepSeatComponent } from './component/step-seat/step-seat.component';
import { StepTimeComponent } from './component/step-time/step-time.component';

// Configure router options to enable fragment navigation
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 70], // Offset for fixed header
  onSameUrlNavigation: 'reload'
};

const routes: Routes = [
  // Set SaloonHomeComponent as the default landing page
  { path: '', redirectTo: '/Shome', pathMatch: 'full' },
  
  // SaloonHomeComponent route
  { path: 'Shome', component: SaloonHomeComponent },
  
  // HomeComponent route (you may want to keep this as a separate home page option)
  { path: 'home', component: HomeComponent },

  // Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'UserDash', component: UserDashboardComponent },


  // Booking routes (potentially protected with AuthGuard)
  { path: 'bookingwizard', component: BookingWizardComponent },
  { path: 'country', component: BookingWizardComponent },
  { path: 'stepdetails', component: StepDetailsComponent },
  { path: 'messagebox', component: MessageBoxComponent },
  { path: 'progressbar', component: ProgressBarComponent },
  { path: 'stepconfirmation', component: StepConfirmationComponent },
  { path: 'steppayment', component: StepPaymentComponent },
  { path: 'stepseat', component: StepSeatComponent },
  { path: 'steptime', component: StepTimeComponent },


  // Fallback route
  { path: '**', redirectTo: '/Shome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}