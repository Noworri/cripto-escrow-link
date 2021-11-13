import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Vendor } from 'src/app/models/vendors.model';
import { TransactionService } from 'src/app/services/transaction.service';
import { VendorsService } from 'src/app/services/vendors.service';
import { LOCAL_STORAGE_ORDER_DATA } from '../checkout/phonenumber/phonenumber.component';




const LOCAL_STORAGE_KEY_VENDOR_DATA = 'vendor-data';

@Component({
  selector: 'app-payements',
  templateUrl: './payements.component.html',
  styleUrls: ['./payements.component.scss'],
})
export class PayementsComponent implements OnInit {
  criptoTypes = [
    {
      name: 'Select the  crypto',
    },
    {
      name: 'Bitcoin',
    },
    {
      name: 'USDT',
    },
    {
      name: 'Ethereum',
    },
    {
      name: 'Bitcoin Cash',
    },
  ];


  formValidationStatus = {
    crypto_type: 'form-select',
    amount: 'form-control ',
    crypto_wallet: 'form-control',
    rate: 'form-control'
  }



  unsubscribeAll$ = new Subject();

  criptoSelected: any = this.criptoTypes[0].name;

  criptoWalletteName = 'crypto';
  username: string | null = '';
  vendorID: any;
  vendorData: any;
  vendorPosts: any;
  form!: FormGroup;
  buyerDetails: any;
  hasError: boolean = false;
  errorMessage: string = '';
  rate: any;
  netPayable: number = 0;
  cryptoData: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private vendorService: VendorsService,
    private router: Router,
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.getUrlParams(window.location.href);
    this.getVendorUrlParams();
    this.getCryptoDetails();
  }

  getVendorUrlParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.vendorID = params
      setTimeout(() => {
        this.getVendorDetails(this.vendorID['id']);
      }, 1000)
    })
  }

  ngAfterContentInit() {
    this.form = this.formBuilder.group({
      crypto_type: [this.criptoTypes[0].name, Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      crypto_wallet: ['', Validators.required],
      rate: ['', Validators.required]
    });
  }

  getAmountInGHS(amount: any, rate: any) {
    const newAmount = amount * rate;
    return newAmount;
  }

  getAmount(rate: any) {
    this.netPayable = this.form.value.amount * rate;
  }

  validatePhoneNumber(value: any) {
    this.vendorService.getBuyerDetails(value).pipe(take(1)).subscribe(resp => {
      if (resp) {
        this.buyerDetails = resp;
        this.setPaymentData();
      } else {
        this.hasError = true;
        this.errorMessage = "Your phone number is not yet registered on noworri";
      }
    })
  }

  getVendorDetails(vendorID: any) {
    this.vendorService
      .getVendorDetails(vendorID)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((response: any) => {
        const vendor: Vendor = response['data'];
        localStorage.setItem(LOCAL_STORAGE_KEY_VENDOR_DATA, JSON.stringify(vendor));
        this.displayVendorData();

        // this.vendorData = vendor;
        // this.vendorPosts = vendor.posts;
        // return this.vendorData;
      });
  }

  getCryptoDetails() {
    this.vendorService
      .getCryptoDetails()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((response: any) => {
        this.cryptoData = response['data'];
        console.log('[cryptoData]', this.cryptoData)
      });
  }

  displayVendorData() {
    this.vendorData = JSON.parse(localStorage.getItem('vendor-data') || '{}')
    const posts = this.vendorData.posts;
    this.vendorPosts = posts.map((post: any) => {
      post.image_url = this.getCryptoURL(post.crypto_type);
      return post;
    });
  }

  getCryptoURL(name: string) {
    const cryptoData = this.cryptoData?.find((crypto: any) => crypto.name === name);
    return cryptoData?.image_url;
  }




  getCryptoIcon(crypto_type: string) {
    const baseRoute: string = 'assetscripto\\';
    switch (crypto_type) {
      case 'Bitcoin':
        return `${baseRoute}1200px-BTC_Logo.svg.png`;
      case 'Ethereum':
        return `${baseRoute}download (9).png`;
      case 'USDT':
        return `${baseRoute}tether-usdt-logo.pn`;
      case 'Bitcoin Cash':
        return `${baseRoute}bitcoin-cash-circle.png`;
      default:
        return `${baseRoute}1200px-BTC_Logo.svg.png`;
    }
  }

  // getUrlParams(url: string) {
  //   const params = new URL(url).searchParams;
  //   this.vendorID = params.get('id');
  //   this.getVendorDetails(this.vendorID);

  // }

  onSelectCripto(criptoSelected: any) {
    if (this.criptoSelected == 'select the  cripto') {
      this.criptoWalletteName = 'cripto';
    } else {
      this.criptoWalletteName = criptoSelected;
    }
  }

  payWithNoworri() {
    this.validatePhoneNumber(this.form.value.phone_number);
  }
  setPaymentData() {
    const amount = this.getAmountInGHS(this.form.value.amount, this.form.value.rate);
    const data = {
      user_id: this.vendorData.user_id,
      items: [
        {
          item_id: `cryptoshop-${this.vendorData.user_id}`,
          items_qty: '1',
          name: this.form.value.crypto_type,
          price: amount,
          description: 'Crypto Currency Transaction',
        },
      ],
      transaction_type: 'cryptocurrency',
      transaction_source: 'vendor',
      delivery_phone: this.vendorData?.user.mobile_phone,
      buyer_wallet: this.form.value.crypto_wallet,
      requirement: 'Crypto Currency Transaction',
      currency: 'GHS',
      callback_url: window.location.href,
      cancel_url: window.location.href,
    };
    this.processPayment(data);
  }

  processPayment(data: any) {

    this.formValidationStatus.crypto_type = this.form.value.crypto_type === 'Select the  crypto' ?
      'form-select is-invalid' : 'form-select is-valid';
    this.formValidationStatus.amount = this.form.value.amount === '' ?
      'form-control is-invalid' : 'form-control is-valid';
    this.formValidationStatus.crypto_wallet = this.form.value.crypto_wallet === '' ?
      'form-control is-invalid' : 'form-control is-valid';

    this.formValidationStatus.rate = this.form.value.rate === '' ? 'form-control is-invalid'
      : 'form-control is-valid';



    console.log(this.formValidationStatus, this.form.value.rate)

    if (this.formValidationStatus.amount
      == 'form-control is-valid' && this.formValidationStatus.crypto_type
      == 'form-select is-valid' && this.formValidationStatus.crypto_wallet
      == 'form-control is-valid' && this.formValidationStatus.rate
      == 'form-control is-valid') {
      localStorage.setItem(LOCAL_STORAGE_ORDER_DATA, JSON.stringify(data));
      this.router.navigate(['checkout/phonenumber']);

    }
    // this.transactionService.processToCheckout(data, this.vendorData.user_id).pipe(takeUntil(this.unsubscribeAll$)).subscribe(response => {
    //   if(response.checkout_url) {
    //     window.location = response.checkout_url;
    //   }
    // })

  }

}

