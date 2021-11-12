import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './views/checkout/create-account/create-account.component';
import { PayComponent } from './views/checkout/pay/pay.component';
import { PhonenumberComponent } from './views/checkout/phonenumber/phonenumber.component';
import { VerifyComponent } from './views/checkout/verify/verify.component';
import { PayementsComponent } from './views/payements/payements.component';
import { of } from 'rxjs'
import { delay } from 'rxjs/operators';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/vendor',
    pathMatch: 'full',
  },
  {
    path: 'vendor',
    children: [
      {
        path: 'payement',
        component: PayementsComponent,
        resolve:{
          load:'loading'
        }
      },
      {
        path:'checkout/phonenumber',
        component:PhonenumberComponent
      }
    ],
  },
  {
    path: 'checkout',
    // children: [
    //   {
    //     path: 'phonenumber',
    //     component: PhonenumberComponent,
    //   },
    //   {
    //     path: 'verify',
    //     component: VerifyComponent,
    //   },
    //   {
    //     path: 'pay',
    //     component: PayComponent,
    //   },
    //   {
    //     path: 'create',
    //     component: CreateAccountComponent,
    //   },
    // ],
    loadChildren: () =>
      import('./views/checkout/checkout.module').then((m) => m.CheckoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // providers: [{
  //   provide: 'loading',
  //   useValue: () => of(true).pipe(delay(1000))
  // }],
})
export class AppRoutingModule {}
