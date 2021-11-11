import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './views/header/header.component';
import { PayementsComponent } from './views/payements/payements.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import {
//   NgbPaginationModule,
//   NgbAlertModule,
// } from '@ng-bootstrap/ng-bootstrap';
// import { NgxFlagsModule } from 'ngx-flags';
// import { IntlTelInputNgModule } from 'intl-tel-input-ng';
// import { MatIconModule } from '@angular/material/icon';
// import { NgOtpInputModule } from 'ng-otp-input';
// import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CheckoutModule } from './views/checkout/checkout.module';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PayementsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    // NgbPaginationModule,
    // NgbAlertModule,
    // NgxFlagsModule,
    // NgxFlagsModule,
    // MatIconModule,
    // NgOtpInputModule,
    // NgxUiLoaderModule,
    CheckoutModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
