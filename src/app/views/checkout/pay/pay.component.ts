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
import { LOCAL_STORAGE_KEY_VENDOR_DATA } from '../../payements/payements.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaymentData } from 'src/app/models/payment.interface';
import { ORDER_DATA_KEY, PAYMENT_DATA_KEY, TRANSACTION_DATA_KEY, USER_API_KEY, USER_DATA_KEY } from 'src/app/models/constants';

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
  avatar: SafeHtml | undefined;

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private loader: NgxUiLoaderService,
    private sanitizer: DomSanitizer
  ) {

    const transactionData = JSON.parse(sessionStorage.getItem(TRANSACTION_DATA_KEY) as string);
    const userData = JSON.parse(sessionStorage.getItem(USER_DATA_KEY) as string);
    const businessData = JSON.parse(
      sessionStorage.getItem(LOCAL_STORAGE_KEY_VENDOR_DATA) as string
    );
    const savedDataString = sessionStorage.getItem(ORDER_DATA_KEY);
    const orderDataSaved = savedDataString !== 'undefined' ? JSON.parse(savedDataString as string) : undefined;

    this.savedOrderData = orderDataSaved;
    this.checkoutData = transactionData;
    this.userData = userData;
    this.api_key = `${this.businessData?.user_id}:${this.userData?.user_uid}`;
    this.businessData = businessData;
  }

  ngOnInit(): void {
    this.avatar =
      this.sanitizer.bypassSecurityTrustHtml(this.businessData?.avatar) ||
      `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
 <g>
   <g>
     <path d="M252.245,0c-73.103,0-132.575,59.472-132.575,132.575s59.472,132.575,132.575,132.575S384.82,205.678,384.82,132.575
       S325.348,0,252.245,0z M252.246,246.21c-58.086,0-106.103-43.815-112.806-100.132c26.198,7.495,83.708,16.958,128.961-25.322
       c12.956,24.025,38.909,52.712,76.954,52.712c4.292,0,8.758-0.418,13.357-1.197C342.576,215.411,300.945,246.21,252.246,246.21z
        M363.278,151.875c-56.966,16.285-82.189-48.291-83.234-51.047c-1.184-3.126-3.93-5.41-7.227-5.983
       c-3.288-0.546-6.649,0.629-8.822,3.163c-43.896,51.193-105.946,34.903-125.193,28.157C142.14,66.475,191.74,18.939,252.246,18.939
       c62.658,0,113.635,50.973,113.635,113.635c0,6.524-0.583,12.91-1.644,19.136C363.917,151.764,363.598,151.787,363.278,151.875z"/>
   </g>
 </g>
 <g>
   <g>
     <path d="M375.341,303.668H138.619c-57.442,0-105.155,46.088-105.155,103.526v94.696c0,5.234,5.22,10.11,10.45,10.11h426.133
       c5.229,0,8.489-4.876,8.489-10.11v-94.696C478.536,349.756,432.783,303.668,375.341,303.668z M459.597,493.061H52.403v-85.867
       c0-46.997,39.215-84.586,86.216-84.586h236.722c47.001,0,84.255,37.589,84.255,84.586V493.061z"/>
   </g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 <g>
 </g>
 </svg>
 `;
    this.userPP =
      this.userData?.photo === null
        ? 'assets/checkout/profilPhotoAnimation.gif'
        : `https://noworri.com/api/public/uploads/images/pp/${this.userData?.photo}`;

    // this.businessLogo =
    //   this.businessData.business_logo === null
    //     ? 'assets/checkout/profilPhotoAnimation.gif'
    //     : `https://noworri.com/api/public/uploads/company/business/${this.businessData.business_logo}`;

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
      const data = {
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
      sessionStorage.setItem(LOCAL_STORAGE_ORDER_DATA, formattedOrderData);
      return this.orderData;
    } else {
      priceList = this.savedOrderData.items.map((data: any) => data.price);
      this.setAmount(priceList);
      return this.savedOrderData;
    }
  }

  removeItem(index: any) {
    this.orderData.splice(index, 1);
    const formattedOrderData = JSON.stringify(this.orderData);
    sessionStorage.setItem(LOCAL_STORAGE_ORDER_DATA, formattedOrderData);
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
    let fee = 0;
    if (price < 200) {
      fee = 5;
    } else if (price > 200 && price < 600) {
      fee = 15;
    } else if (price > 600 && price < 1000) {
      fee = 25;
    } else if (price > 1000) {
      fee = (price * 2.5) / 100 + 0.75;
    }
    // 0GH -200GH = Fees 5GH

    // 201GH - 600GH = Fees 15GH

    // 601GH - 1000GH = Fess 25GH

    // +1000 GH = Fees 2.5%+ 0.75 GH

    return Number(fee);
  }

  onProceed() {
    // const transactionData = {...this.checkoutData};
    // transactionData.price = `${Math.round(this.totalPrice as number)}`;
    const paymentData: PaymentData = {
      email: this.userData.email,
      amount: `${this.amount}`,
      currency: this.checkoutData.currency,
      callback_url: `${window.location.href}`,
      price: `${this.totalPrice}`,
    };
    sessionStorage.setItem(PAYMENT_DATA_KEY, JSON.stringify(paymentData));
    this.router.navigate(['/payement-option']);
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
      .createTransaction(
        this.checkoutData,
        this.api_key,
        this.isTestTransaction
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (transaction: any) => {
          if (transaction) {
            let order = this.getOrderData();
            order = JSON.stringify(order);
            const callbackUrl = `${this.checkoutData.callback_url}?reference=${this.transaction_ref}&order_id=${this.checkoutData.order_id}&order-data=${order}`;
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

  get isTestTransaction(): boolean {
    return this.api_key.includes('test');
  }
}
