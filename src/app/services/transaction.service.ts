import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, throwError as observableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) {}

  processToCheckout(paymentData: any, credentials: string) {
    const url = environment.generateCheckoutUrl;
    let header = new HttpHeaders();
    header = header.append('Authorization', `Bearer ${credentials}`);
    let params = new HttpParams();
    params = params.append('user_id', paymentData.user_id);
    params = params.append('items', paymentData.items);
    params = params.append('currency', 'GHS');
    params = params.append('callback_url', paymentData.callback_url);
  
    return this.http
      .post(url, paymentData, {
        // responseType: 'json',
        // params: params,
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
  
  createTransaction(transactionDetails: any, credentials: string, isTestTransaction = false) {
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
}
