import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './Guard/AuthGuard';
import { HomeComponent } from './component/home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register',component: RegisterComponent, },
  { path: '',component: HomeComponent,canActivate: [AuthGuard],  },
  // Redirect to login for any undefined routes
  // {path: '**',redirectTo: 'login', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
