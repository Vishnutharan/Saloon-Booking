import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './Guard/AuthGuard';
import { HomeComponent } from './component/home/home.component';
import { BookingWizardComponent } from './component/booking-wizard/booking-wizard.component';
import { SaloonHomeComponent } from './component/saloon-home/saloon-home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'Shome', component: SaloonHomeComponent },
  { path: 'bookingwizerd', component: BookingWizardComponent },
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', redirectTo: 'login' }
  // { path: 'booking', component: BookingWizardComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
