import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheckoutService } from '../services/checkout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  LOCAL_STORAGE_API_KEY,
  LOCAL_STORAGE_BUSINESS_DATA,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_ORDER_DATA,
  LOCAL_STORAGE_USER_KEY,
} from '../phonenumber/phonenumber.component';
import { BusinessTransactionData } from '../models/BusinessTransactionData';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  userData: any;
  isSecuring: boolean = false;
  orderData: any[] = [];
  errorMessage?: string;
  hasError = false;
  hasParams = false;

  transaction_ref: string | undefined;
  amount?: number;
  totalPrice: number = 0;
  checkoutData: any;
  savedOrderData: any;
  api_key: string = '';
  businessData: any;
  userPP?: string;
  businessLogo?: string;
  address: string;
  isChangingAddress = false;
  isUpdatingAddress: boolean = false;

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private loader: NgxUiLoaderService
  ) {
    const transactionData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '');
    const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY) || '');
    const businessData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_BUSINESS_DATA) || ''
    );
    const orderDataSaved = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ORDER_DATA) || ''
    );
    this.savedOrderData = orderDataSaved;
    this.checkoutData = transactionData;
    this.userData = userData;
    this.address = userData.address;
    this.api_key = localStorage.getItem(LOCAL_STORAGE_API_KEY) || '';
    this.businessData = businessData;
  }

  ngOnInit(): void {
    this.userPP =
      this.userData.photo === null
        ? 'assets/checkout/profilPhotoAnimation.gif'
        : `https://noworri.com/api/public/uploads/images/pp/${this.userData.photo}`;

    this.businessLogo =
      this.businessData.business_logo === null
        ? 'assets/checkout/profilPhotoAnimation.gif'
        : `https://noworri.com/api/public/uploads/company/business/${this.businessData.business_logo}`;

    this.getOrderData();

    const url = window.location.href;
    this.getUrlParams(url);
  }

  getOrderData() {
    let itemsData = this.checkoutData.items;

    if (typeof itemsData === 'string') {
      itemsData = JSON.parse(this.checkoutData.items);
    }
    if (!!itemsData.name) {
      const data =
      {
        name: itemsData.name,
        price: itemsData.price,
        description: itemsData.description,
        items_qty: itemsData.items_qty,
        item_id: itemsData.item_id,
      };
      this.orderData.push(data);
    } else {
      itemsData.forEach((item: any) => {
        this.orderData.push({
          name: item.name,
          price: item.price,
          description: item.description,
          items_qty: item.items_qty,
          item_id: item.item_id,
          });
      });
    }
    let priceList = this.orderData.map((data: any) => data.price);
    if (!this.savedOrderData) {
      this.setAmount(priceList);
      const formattedOrderData = JSON.stringify(this.orderData);
      localStorage.setItem(LOCAL_STORAGE_ORDER_DATA, formattedOrderData);
      return this.orderData;
    } else {
      priceList = this.savedOrderData.map((data: any) => data.price);
      this.setAmount(priceList);
      return this.savedOrderData;
    }
  }

  toggleChangeAddress() {
    this.isChangingAddress = !this.isChangingAddress;
  }

  removeItem(index: any) {
    this.orderData.splice(index, 1);
    const formattedOrderData = JSON.stringify(this.orderData);
    localStorage.setItem(LOCAL_STORAGE_ORDER_DATA, formattedOrderData);
    const priceList = this.orderData.map((data) => data.price);
    this.setAmount(priceList);
  }

  getUrlParams(url: string) {
    let params = new URL(url).searchParams;
    this.transaction_ref = params.get('reference') || undefined;
    if (params.get('reference')) {
      this.hasParams = true;
    }

    if (this.transaction_ref) {
      this.checkSuccessSecuredFunds(this.transaction_ref);
    }
  }

  setAmount(prices: any) {
    this.totalPrice = prices
      .reduce((acc: any, cur: any) => acc + Number(cur), 0)
      .toFixed(2);
    const sum = Number(this.totalPrice) + this.getNoworriFee(this.totalPrice);
    this.amount = Number(sum.toFixed(2));
  }

  getNoworriFee(price: any): number {
    const fee = ((price / 100) * 1).toFixed(2);
    return Number(fee);
  }

  onPay() {
    this.loader.start();
    this.isSecuring = true;
    const transactionData = {
      email: this.userData.email,
      amount: Math.round(this.totalPrice),
      currency: this.checkoutData.currency,
      callback_url: `${window.location.href}`,
    };
    this.loader.stop();
    this.checkoutService
      .payStackPayment(transactionData, this.api_key)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: any) => {
        window.location.replace(`${response.data.authorization_url}`);
        return false;
      });
  }

  checkSuccessSecuredFunds(ref: string) {
    this.checkoutService
      .checkTransactionStatus(ref, this.api_key)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((statusData) => {
        if (statusData.data && statusData.data.status === 'success') {
          this.createTransaction();
        } else {
          this.hasError = true;
          this.errorMessage = statusData.message;
        }
      });
  }

  createTransaction() {
    this.checkoutData['payment_id'] = this.transaction_ref;
    this.checkoutData['price'] = Number(this.totalPrice).toFixed(2);
    this.checkoutData['name'] = this.businessData.trading_name;
    this.checkoutData['items'] = this.getOrderData();
    this.checkoutService
      .createTransaction(this.checkoutData, this.api_key, this.isTestTransaction)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (transaction: any) => {
          if (transaction) {
            let order = this.getOrderData();
            order = JSON.stringify(order);
            const callbackUrl = `${this.checkoutData.callback_url}?reference=${this.transaction_ref}&order_id=${this.checkoutData.order_id}&order-data=${order}`
            window.location.replace(callbackUrl);
          } else {
            this.hasError = true;
            this.errorMessage = 'Something went wrong';
          }
        },
        (error) => {
          console.log(error.message);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get isTestTransaction(): boolean{
    return this.api_key.includes('test');
  }
 }
