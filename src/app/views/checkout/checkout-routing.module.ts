import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EmptyUserPageComponent } from './empty-user-page/empty-user-page.component';
import { OtpToProceedComponent } from './otp-to-proceed/otp-to-proceed.component';
import { PayComponent } from './pay/pay.component';
import { PayementOptionComponent } from './payement-option/payement-option.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
    {
      path: "phonenumber",
      component: PhonenumberComponent
    },
    {
      path: 'verify',
      component: VerifyComponent
    },
    {
      path: 'pay',
      component: PayComponent
    },
    {
      path: 'create',
      component: CreateAccountComponent
    },
    {
      path: 'payement-option',
      component: PayementOptionComponent
    },
    {
      path: "otp-to-proceed/:reference",
      component: OtpToProceedComponent
    },
    {
      path: 'download-app',
      component: EmptyUserPageComponent
    }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class CheckoutRoutingModule {}

export const CheckoutRoutes = RouterModule.forChild(routes);
                                                   