import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class VendorsService {
  constructor(private http: HttpClient) { }

  payStackPayment(paymentData: any, credentials: string) {
    const url = environment.generateCheckoutUrl;
    let header = new HttpHeaders();
    header = header.append('Authorization', credentials);
    let params = new HttpParams();
    params = params.append('email', paymentData.email);
    params = params.append('amount', paymentData.amount);
    params = params.append('currency', paymentData.currency);
    params = params.append('callback_url', paymentData.callback_url);

    return this.http
      .post(url, null, {
        responseType: 'json',
        params: params,
        headers: header,
      })
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('Error', error.message);
          return observableThrowError(error);
        })
      );
  }

  createTransaction(
    transactionDetails: any,
    credentials: string,
    isTestTransaction = false
  ) {
    let header = new HttpHeaders();
    header = header.append('Authorization', credentials);
    const url = isTestTransaction
      ? 'https://api.noworri.com/api/createbusinesstransactiontest'
      : environment.createBusinessTransactionUrl;
    if (!transactionDetails.deadline || !transactionDetails.revision) {
      transactionDetails.deadline = '';
      transactionDetails.revision = 0;
    }
    if (!transactionDetails.file_path) {
      transactionDetails.file_path = 'N/A';
    }
    return this.http.post(url, transactionDetails, { headers: header }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error', error.message);
        return observableThrowError(error);
      })
    );
  }

  getVendorDetails(id: any) {
    const url = `https://api.noworri.com/api/cryptovendor/${id}`;
    let header = new HttpHeaders();
    // header = header.append('Authorization', credentials);
    header.append('Access-Control-Allow-Origin', '*');
    return this.http.get(url,{ headers: header }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error: ', error.message);
        return observableThrowError(error);
      })
    );
  }

  getBuyerDetails(phoneNumber: any) {
    const url = environment.getuserbyphone;
    // let header = new HttpHeaders();
    // header = header.append('Authorization', credentials);
    const params = {
      user_phone: phoneNumber,
    };
    return this.http.post(url, params).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error: ', error.message);
        return observableThrowError(error);
      })
    );
  }

  getVendors(id: any) {
    const url = `https://api.noworri.com/api/cryptovendors`;
    let header = new HttpHeaders();
    // header = header.append('Authorization', credentials);
    return this.http.post(url, id, { headers: header }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error: ', error.message);
        return observableThrowError(error);
      })
    );
  }
}
