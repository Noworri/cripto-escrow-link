/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VendorsService } from './vendors.service';

describe('Service: Vendors', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorsService]
    });
  });

  it('should ...', inject([VendorsService], (service: VendorsService) => {
    expect(service).toBeTruthy();
  }));
});
