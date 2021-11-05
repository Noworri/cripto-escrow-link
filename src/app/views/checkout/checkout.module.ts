import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { PayComponent } from './pay/pay.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { VerifyComponent } from './verify/verify.component';
import { MatIconModule } from '@angular/material/icon';
import {
  NgbPaginationModule,
  NgbAlertModule,
} from '@ng-bootstrap/ng-bootstrap';
import { IntlTelInputNgModule } from 'intl-tel-input-ng';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxFlagsModule } from 'ngx-flags';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutRoutingModule } from './checkout-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NgbPaginationModule,
    NgbAlertModule,
    IntlTelInputNgModule.forRoot(),
    NgxFlagsModule,
    NgxFlagsModule,
    MatIconModule,
    NgOtpInputModule,
    NgxUiLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    CheckoutRoutingModule
  ],
  declarations: [
    CheckoutComponent,
    CreateAccountComponent,
    PayComponent,
    VerifyComponent,
    PhonenumberComponent,
  ],
  exports: [
    CheckoutComponent,
    CreateAccountComponent,
    PayComponent,
    VerifyComponent,
    PhonenumberComponent,
  ],
})
export class CheckoutModule {}
