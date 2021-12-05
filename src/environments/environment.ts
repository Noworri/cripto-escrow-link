// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: `https://api.noworri.com/api/`,
  payChargeUrl: `https://api.noworri.com/api/securewithnoworritest`,
  getuserbyphone: `https://api.noworri.com/api/getuserbyphone`,
  generateCheckoutUrl: `https://api.noworri.com/api/buycryptowithnoworri`,
  checkTransactionStatusUrl: `https://api.noworri.com/api/verifybusinessclientspayment`,
  addAccountUrl: `https://api.noworri.com/api/adduseraccounttest/`,
  deleteAccountUrl: `https://api.noworri.com/api/deleteduseraccounttest`,
  createCryptoTransactionUrl: `https://api.noworri.com/api/createcryptotransactiontest`,
  sendVerificationCodeUrl: `https://api.noworri.com/api/sendcryptoverificationcodetest`,
  checkNoworripaymentUrl : `https://api.noworri.com/api/checknoworricheckoutpaymentstatustest`,
  verifyPaymentOTPUrl: `https://api.noworri.com/api/submitotptest`,

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
