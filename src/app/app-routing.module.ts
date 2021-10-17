import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
