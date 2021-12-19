import { Component, OnInit } from '@angular/core';

const business_data = 'noworri-user-business';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  businessName: string = '';

  constructor() {}

  ngOnInit(): void {
    this.getBusinessName();
  }

  getBusinessName() {
    let businessData = JSON.parse(localStorage.getItem(business_data) || '');
    this.businessName = businessData.trading_name;
 
  }
}
