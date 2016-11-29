import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/Rx';

@Injectable()
export class HistoricalPriceService {
    apiName = "historicalprice";
    servicesUrl: any;
    storageKey: any;
    data: any;
    currentDate: any;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) {
        this.servicesUrl = globalVars.servicesUrl + this.apiName + "/";
    }

    getClosePriceData(instrumentId) {
        this.storageKey = this.apiName + "_" + this.globalVars.generalSettings.currency.value;
        return new Promise(resolve => {
            this.storage.get(this.storageKey).then(sdata => {
                if (sdata != null) {
                    var storageData = sdata;
                    var TTL = this.globalVars.historicalprice.storageTTL;
                    if (TTL <= (new Date().getTime() - storageData.cacheTime)) {
                        this.getClosePriceDataFromServices(resolve, instrumentId, null);
                    }
                    else {
                        if (storageData.data[instrumentId] != undefined && storageData.data[instrumentId] != null)
                            resolve(storageData.data[instrumentId]);
                        else
                            this.getClosePriceDataFromServices(resolve, instrumentId, storageData);
                    }
                }
                else {
                    this.getClosePriceDataFromServices(resolve, instrumentId, null);
                }
            });
        });
    }

    getClosePriceDataFromServices(resolve, instrumentid, currentStorageData) {
        if (this.globalVars.isOnline) {
            var requestParams = instrumentid;
            if (!this.globalVars.generalSettings.currency.isDefault)
                requestParams += "/" + this.globalVars.generalSettings.currency.value + "/";
            this.http.get(this.servicesUrl + requestParams)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        this.data = res.json();
                        let storageData = currentStorageData;
                        if (storageData == null)
                            storageData = { data: {}, cacheTime: new Date().getTime() };
                        storageData.data[instrumentid] = this.data;
                        this.storage.set(this.storageKey, storageData);
                        resolve(this.data);
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

    getHistoricalPriceData(instrumentId, currentDate) {
        this.currentDate = currentDate;
        var requestParams = instrumentId + "/" + currentDate;
        if (!this.globalVars.generalSettings.currency.isDefault)
            requestParams += "/" + this.globalVars.generalSettings.currency.value + "/";
        return new Promise(resolve => {
            this.http.get(this.servicesUrl + requestParams)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        this.data = res.json();
                        resolve(this.data);
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
        });
    }

    getWatchListData(ids, currentDate) {
        var requestParams = ids + "/" + currentDate;
        if (!this.globalVars.generalSettings.currency.isDefault)
            requestParams += "/" + this.globalVars.generalSettings.currency.value + "/";
        return new Promise(resolve => {
            // this.http.get(this.globalVars.servicesUrl + "watchlist/" + this.apiName + "/" + requestParams)
            this.http.get('data.json')
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        let data = res.json();
                        if (data.length > 0) {
                            resolve(data);
                        }
                        else
                            resolve([]);
                    }
                    else
                        resolve([]);
                },
                error => {
                    console.log(error);
                    resolve([]);
                }
                );
        });
    }
}