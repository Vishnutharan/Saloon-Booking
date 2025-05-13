import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './Guard/AuthGuard';
import { HomeComponent } from './component/home/home.component';
import { BookingWizardComponent } from './component/booking-wizard/booking-wizard.component';
import { SaloonHomeComponent } from './component/saloon-home/saloon-home.component';

const routes: Routes = [
  // { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'Shome', component: SaloonHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'booking', component: BookingWizardComponent, canActivate: [AuthGuard]  },
  // Redirect to login for any undefined routes
  // { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
