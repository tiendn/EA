import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
//import 'rxjs/Rx';
import 'rxjs/operator/timeout';
import 'rxjs/operator/retry';

@Injectable()
export class TickerService {
    apiKey = "ticker";
    servicesUrl: any;
    storageKey: any;
    data: any;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) { }

    getTickerData() {
        this.servicesUrl = this.globalVars.servicesUrl + this.apiKey + '/' + this.globalVars.companyCode + "/";
        this.storageKey = this.apiKey + "_" + this.globalVars.generalSettings.currency.value;
        if (this.globalVars.isOnline) {
            let currency = "";
            if (!this.globalVars.generalSettings.currency.isDefault) {
                currency = this.globalVars.generalSettings.currency.value + "/";
            }
            return new Promise(resolve => {
                this.http.get(this.servicesUrl + currency)
                    .timeout(this.globalVars.requestTimeout, new Error('timeout exceeded'))
                    .retry(this.globalVars.retry)
                    .subscribe(
                    res => {
                        this.data = res.json();
                        resolve(this.data);
                        this.storage.set(this.storageKey, this.data);
                    },
                    error => {
                        console.log(error);
                        this.getTickerDataFromStorage(resolve);
                    }
                    );
            });
        }
        else {
            return new Promise(resolve => {
                this.getTickerDataFromStorage(resolve);
            });
        }
    }

    getTickerDataFromStorage(resolve) {
        this.storage.get(this.storageKey).then(sData => {
            if (sData != null) {
                this.data = sData;
                resolve(this.data);
            }
            else {
                resolve([]);
            }
        });
    }
}