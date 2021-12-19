import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { USER_DATA_KEY } from 'src/app/models/constants';
import { BusinessTransactionData } from '../models/BusinessTransactionData';
import {
  LOCAL_STORAGE_API_KEY,
  LOCAL_STORAGE_KEY,
} from '../phonenumber/phonenumber.component';
import { CheckoutService } from '../services/checkout.service';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  businessTransactionData: BusinessTransactionData | null = null;
  prefixCountryCode: string | null = null;
  user_phone: string | null = null;
  user_api_key: string = '';
  errorMessage: string | null = null;
  hasError = false;
  otp: string = '';

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private loader: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

  onVerify() {
    this.loader.start();
    this.checkoutService
      .verifyUser({code: this.otp})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: any) => {
        if (response['status'] === 200) {
          this.loader.stop();
          this.router.navigate(['pay']);
        } else {
          this.loader.stop();
          this.hasError = true;
          this.errorMessage = response['message'];
        }
      });
  }
}
