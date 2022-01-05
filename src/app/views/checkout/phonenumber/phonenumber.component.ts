import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TRANSACTION_DATA_KEY, USER_DATA_KEY } from 'src/app/models/constants';
import {
  BusinessTransactionData,
  BusinessTransactionItem,
} from '../models/BusinessTransactionData';
import { CheckoutService } from '../services/checkout.service';

export const LOCAL_STORAGE_KEY = 'checkout-data';
export const LOCAL_STORAGE_API_KEY = 'checkout-data-api';
export const LOCAL_STORAGE_USER_KEY = 'noworri-user-session';
export const LOCAL_STORAGE_BUSINESS_DATA = 'noworri-user-business';
export const LOCAL_STORAGE_ORDER_DATA = 'order-data';

@Component({
  selector: 'app-phonenumber',
  templateUrl: './phonenumber.component.html',
  styleUrls: ['./phonenumber.component.scss'],
})
export class PhonenumberComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  businessTransactionData!: BusinessTransactionData | any;
  prefixCountryCode!: string;
  user_phone!: string;
  user_api_key!: string;
  errorMessage!: string;
  userData: any;
  businessData: any;
  hasError = false;
  isValidInputType!: boolean;
  checkoutItemsData!: BusinessTransactionItem[];
  cancelUrl!: string;
  isSendingCode: boolean = false;

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private loader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.getBusinessData();
    const orderData = sessionStorage.getItem(LOCAL_STORAGE_ORDER_DATA);
    this.businessTransactionData =JSON.parse(`${orderData}`) || null;
  }

  validatePhoneInput(phoneNumber: string) {
    const regEx = /^\d*\d*$/;
    if (phoneNumber.match(regEx)) {
      return (this.isValidInputType = true);
    } else {
      return (this.isValidInputType = false);
    }
  }

  onProceed(form: NgForm) {
    this.isSendingCode = true;
    const telInputPlaceholderInputValue = document
      .getElementsByTagName('input')[0]
      .getAttribute('placeholder');
    const intelInputId = document
      .getElementsByTagName('input')[0]
      .getAttribute('data-intl-tel-input-id');
    if (telInputPlaceholderInputValue === '023 123 4567') {
      this.prefixCountryCode = '+233';
    } else if (telInputPlaceholderInputValue === '0802 123 4567') {
      this.prefixCountryCode = '+234';
    } else if (intelInputId === '2') {
      this.prefixCountryCode = '+225';
    }

    this.validatePhoneInput(form.value['userPhone']);
    if (this.isValidInputType === true) {
      this.user_phone = `${this.prefixCountryCode}${form.value['userPhone']}`;
      const params = {
        mobile_phone: this.user_phone,
      };
      this.sendVerificationCode(params)
    } else {
      this.hasError = true;
      this.errorMessage = 'Invalid Phone number';
    }
  }

  sendVerificationCode(params: any) {
    this.loader.start();
    this.checkoutService
    .sendVerificationCode(params)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((response: any) => {
      this.loader.stop();
      this.isSendingCode=false;
      if (response['status'] === 'success') {
        this.loader.stop();
        this.userData = response['data'];
        this.businessTransactionData['initiator_id'] =
          response['data'].user_uid;
        const transactionDetails = JSON.stringify(
          this.businessTransactionData
        );
        sessionStorage.setItem(TRANSACTION_DATA_KEY, transactionDetails);
        const data = JSON.stringify(response['data']);
        sessionStorage.setItem(USER_DATA_KEY, data);
        this.router.navigate(['verify']);
      } else {
        this.loader.stop();
        this.hasError = true;
        this.errorMessage = response['message'];
        setTimeout(() => {
          this.router.navigate(['create']);
        }, 4000);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUrlParams(url: string) {
    const params = new URL(url).searchParams;
    const items = params.get('items') || '';
    this.checkoutItemsData = JSON.parse(items);
    // this.user_api_key = params.get('credentials') || '';
    this.cancelUrl = params.get('cancel_url') || '';
    // this.businessTransactionData = {
    //   user_id: params.get('user_id') || undefined,
    //   initiator_id: '',
    //   initiator_role: 'buy',
    //   name: '',
    //   price: '',
    //   items: this.checkoutItemsData,
    //   description: 'e-commerce transaction',
    //   delivery_phone: params.get('delivery_phone') || undefined,
    //   payment_id: '',
    //   currency: params.get('currency') || undefined,
    //   callback_url: params.get('callback_url')|| undefined,
    //   cancel_url: params.get('cancel_url')|| undefined,
    //   order_id: params.get('order_id')|| undefined
    // };
    // localStorage.setItem(LOCAL_STORAGE_API_KEY, this.user_api_key);
  }

  getBusinessData() {
    this.checkoutService
      .getBusinessDetails(
        this.businessTransactionData?.user_id,
        this.user_api_key
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((businessData) => {
        this.businessData = businessData;
        localStorage.setItem(
          LOCAL_STORAGE_BUSINESS_DATA,
          JSON.stringify(this.businessData)
        );
      });
  }
}
