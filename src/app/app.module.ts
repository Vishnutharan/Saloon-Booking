import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { AuthService } from './Services/AuthService';
import { AuthGuard } from './Guard/AuthGuard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './Interceptor/AuthInterceptor';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';
import { StepServiceComponent } from './component/step-service/step-service.component';
import { StepTimeComponent } from './component/step-time/step-time.component';
import { StepSeatComponent } from './component/step-seat/step-seat.component';
import { StepDetailsComponent } from './component/step-details/step-details.component';
import { StepPaymentComponent } from './component/step-payment/step-payment.component';
import { StepConfirmationComponent } from './component/step-confirmation/step-confirmation.component';
import { BookingWizardComponent } from './component/booking-wizard/booking-wizard.component';
import { MessageBoxComponent } from './component/message-box/message-box.component';
import { SaloonHomeComponent } from './component/saloon-home/saloon-home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MessageBoxComponent,
    ProgressBarComponent,
    StepServiceComponent,
    StepTimeComponent,
    StepSeatComponent,
    StepDetailsComponent,
    StepPaymentComponent,
    StepConfirmationComponent,
    BookingWizardComponent,
    SaloonHomeComponent
  ],
  imports: [
   BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule 
  ],
  providers: [AuthService, AuthGuard,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
