import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { VendorsService } from 'src/app/services/vendors.service';

@Component({
  selector: 'app-payements',
  templateUrl: './payements.component.html',
  styleUrls: ['./payements.component.scss'],
})
export class PayementsComponent implements OnInit {
  criptoName = [
    {
      name: 'select the  cripto',
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

  unsubscribeAll$ = new Subject();

  criptoSelected: any = this.criptoName[0].name;

  criptoWalletteName = 'cripto';
  username: string | null = '';
  vendorID: any;
  vendorData: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private vendorService: VendorsService
  ) {
  
  }

  ngOnInit(): void {
    this.getUrlParams(window.location.href);
  }

  getVendorDetails(vendorID: any) {
    this.vendorService
      .getVendorDetails(vendorID)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((response: any) => {
        this.vendorData = response['data'];
        return this.vendorData
      });
  }

  getUrlParams(url: string) {
    const params = new URL(url).searchParams;
    this.vendorID = params.get('id');
    this.getVendorDetails(this.vendorID);
  }

  onSelectCripto(criptoSelected: any) {
    if (this.criptoSelected == 'select the  cripto') {
      this.criptoWalletteName = 'cripto';
    } else {
      this.criptoWalletteName = criptoSelected;
    }
  }
}
