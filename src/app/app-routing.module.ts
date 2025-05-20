import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { SaloonHomeComponent } from './component/saloon-home/saloon-home.component';
import { BookingWizardComponent } from './component/booking-wizard/booking-wizard.component';
import { AuthGuard } from './Guard/AuthGuard';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';

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
  { path: 'booking', component: BookingWizardComponent },
  { path: 'country', component: BookingWizardComponent },
  
  // Fallback route
  { path: '**', redirectTo: '/Shome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}