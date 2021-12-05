import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { OtpToProceedComponent } from './otp-to-proceed/otp-to-proceed.component';
import { EmptyUserPageComponent } from './empty-user-page/empty-user-page.component';
import { PayementOptionComponent } from './payement-option/payement-option.component';

@NgModule({
  imports: [
    CommonModule,
    NgbPaginationModule,
    NgbAlertModule,
    IntlTelInputNgModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
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
    OtpToProceedComponent,
    EmptyUserPageComponent,
    PayementOptionComponent
  ],
  exports: [
    CheckoutComponent,
    CreateAccountComponent,
    PayComponent,
    VerifyComponent,
    PhonenumberComponent,
    OtpToProceedComponent,
    EmptyUserPageComponent,
    PayementOptionComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CheckoutModule {}
