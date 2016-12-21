import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/operator/timeout';
import 'rxjs/operator/retry';

@Injectable()
export class PerformanceService {

    apiName = "performancedata";
    servicesUrl: string;
    storageKey: string;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) {
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/" + this.globalVars.companyCode + "/";
    }

    getPerformanceData(instrumentId) {
        this.storageKey = this.apiName + "_" + this.globalVars.generalSettings.language.value.toLowerCase() + "_" + this.globalVars.generalSettings.currency.value;
        return new Promise(resolve => {
            this.storage.get(this.storageKey).then(sdata => {
                if (sdata != null) {
                    var storageData = sdata;
                    var TTL = this.globalVars.sharegraph.performanceDataStorageTTL;
                    if (TTL <= (new Date().getTime() - storageData.cacheTime)) {
                        this.getPerformanceDataFromServices(resolve, instrumentId, null);
                    }
                    else {
                        if (storageData.data[instrumentId] != undefined && storageData.data[instrumentId] != null)
                            resolve(storageData.data[instrumentId]);
                        else
                            this.getPerformanceDataFromServices(resolve, instrumentId, storageData);
                    }
                }
                else {
                    this.getPerformanceDataFromServices(resolve, instrumentId, null);
                }
            });
        });
    }

    getPerformanceDataFromServices(resolve, instrumentid, currentStorageData) {
        if (this.globalVars.isOnline) {
            let requestParams = instrumentid + "/" + this.globalVars.generalSettings.language.value;
            if (!this.globalVars.generalSettings.currency.isDefault)
                requestParams += "/" + this.globalVars.generalSettings.currency.value + "/";
            this.http.get(this.servicesUrl + requestParams)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        let data = res.json();
                        let storageData = currentStorageData;
                        if (storageData == null)
                            storageData = { data: {}, cacheTime: new Date().getTime() };
                        storageData.data[instrumentid] = data;
                        this.storage.set(this.storageKey, storageData);
                        resolve(data);
                    }
                    else {
                        resolve([]);
                    }
                },
                error => {
                    console.log(error);
                    resolve([]);
                }
                );
        }
        else {
            if (currentStorageData != null && currentStorageData.data[instrumentid] != undefined && currentStorageData.data[instrumentid] != null)
                resolve(currentStorageData.data[instrumentid]);
            else
                resolve([]);
        }
    }

}