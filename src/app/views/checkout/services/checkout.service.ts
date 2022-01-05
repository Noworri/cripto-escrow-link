import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private http: HttpClient) {}

  sendVerificationCode(data: any) {
    const url = environment.sendVerificationCodeUrl;
    // const url = 'http://127.0.0.1:8000/api/sendcryptoverificationcodetest';
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error: ', error.message);
        return observableThrowError(error);
      })
    );
  }

  verifyUser(data: any) {
    const url = `https://api.noworri.com/api/verifycryptouser`;
    // const url = 'http://127.0.0.1:8000/api/verifycryptouser';
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error: ', error.message);
        return observableThrowError(error);
      })
    );
  }

  checkTransactionStatus(ref: string, credentials: string) {
    const url = `${environment.checkTransactionStatusUrl}/${ref}`;
    let header = new HttpHeaders();
    header = header.append('Authorization', credentials);
    return this.http.get(url, { responseType: 'json', headers: header }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error', error.message);
        return observableThrowError(error);
      })
    );
  }


  getBusinessDetails(user_id: string | undefined, credentials: string) {
    const url = `https://api.noworri.com/api/getuserbusinessdata/${user_id}`;
    let header = new HttpHeaders();
    header = header.append('Authorization', credentials);
    return this.http.get(url, { responseType: 'json', headers: header }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error', error.message);
        return observableThrowError(error);
      })
    );
  }

  payStackPayment(paymentData: any, credentials: string) {
    const url = environment.payChargeUrl;
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

  createTransaction(transactionDetails: any, credentials: string, isTestTransaction: boolean) {
    let header = new HttpHeaders();
    header = header.append('Authorization', credentials);
    // const url = 'http://127.0.0.1:8000/api/createbusinesstransactiontest';
    const url = isTestTransaction
      ? 'https://api.noworri.com/api/createcryptotransactiontest'
      : environment.createCryptoTransactionUrl;
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
}
