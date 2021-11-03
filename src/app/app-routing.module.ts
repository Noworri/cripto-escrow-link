import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './views/checkout/create-account/create-account.component';
import { PayComponent } from './views/checkout/pay/pay.component';
import { PhonenumberComponent } from './views/checkout/phonenumber/phonenumber.component';
import { VerifyComponent } from './views/checkout/verify/verify.component';
import { PayementsComponent } from './views/payements/payements.component';

const routes: Routes = [

  {
    path: "",
    redirectTo: "/vendor",
    pathMatch: "full",
  },
  {
    path: "",
    children: [
      {
        path: "vendor",
        component: PayementsComponent
      },
    ]
  },
  {
    path: "checkout",
    loadChildren: () =>
      import("./views/checkout/checkout.module").then(
        (m) => m.CheckoutModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
