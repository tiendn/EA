import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/Rx';

@Injectable()
export class ICalService {
    apiName = "investmentcalculator";
    servicesUrl: string;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) {
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/";
    }

    getICalData(inputData) {
        let params = "";
        let value = "";
        if (inputData.getByAmount) {
            params = "byamount/";
            value = inputData.amount;
        }
        else {
            params = "byshares/";
            value = inputData.noOfShares;
        }

        //var dividend = $('#ical-dividends-btn').prop("checked");
        params += inputData.instrumentid
            + "/" + value
            + "/" + inputData.startDate
            + "/" + inputData.endDate
            + "/" + inputData.dividends;
        if (!this.globalVars.generalSettings.currency.isDefault)
            params += "/" + this.globalVars.generalSettings.currency.value;

        return new Promise(resolve => {
            this.http.get(this.servicesUrl + params)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        let data = res.json();
                        resolve(data);
                    }
                    else {
                        resolve(null);
                    }
                },
                error => {
                    console.log(error);
                    resolve(null);
                }
                );
        });
    }

    getCompareData(type, lstId, sDate, eDate) {
        let params = lstId + "/" + sDate + "/" + eDate;
        if (!this.globalVars.generalSettings.currency.isDefault)
            params += "/" + this.globalVars.generalSettings.currency.value;

        return new Promise(resolve => {
            this.http.get(this.globalVars.servicesUrl + type + "/" + params)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null && res.json().length > 0) {
                        let data = res.json();
                        resolve(data);
                    }
                    else {
                        resolve(null);
                    }
                },
                error => {
                    console.log(error);
                    resolve(null);
                }
                );
        });
    }
}