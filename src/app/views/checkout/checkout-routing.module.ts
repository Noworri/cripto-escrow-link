import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { CreateAccountComponent } from './create-account/create-account.component';
import { PayComponent } from './pay/pay.component';
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
    }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class CheckoutRoutingModule {}

export const CheckoutRoutes = RouterModule.forChild(routes);
                                                   