import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/Rx';

@Injectable()
export class ReportsService {
    apiName = "documentlibrary";
    servicesUrl: any;
    lstDownloadingStorageKey: string;
    storageKey: string;
    tabid: any;
    data: any;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) {
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/";
        this.lstDownloadingStorageKey = this.apiName + "_downloading";
    }

    getReportData(tabid) {
        this.tabid = tabid;
        this.storageKey = this.globalVars.currentModule + "_" + tabid + "_" + this.globalVars.generalSettings.language.value.toLowerCase();

        return new Promise(resolve => {
            this.storage.get(this.storageKey).then(storageData => {
                if (storageData != null) {
                    let sData = storageData;
                    let TTL = this.globalVars.report.storageTTL;
                    if (TTL <= (new Date().getTime() - sData.cacheTime) && this.globalVars.isOnline)
                        this.getReportDataFromServices(resolve);
                    else {
                        this.data = sData.data;
                        resolve(this.data);
                    }
                }
                else
                    this.getReportDataFromServices(resolve);
            });
        });
    }

    getReportDataFromServices(resolve) {
        //let params = this.globalVars.companyCode + "/" + this.globalVars.generalSettings.language.value.toLowerCase() + "/" +
        let params = "ae-emaar" + "/" + this.globalVars.generalSettings.language.value.toLowerCase() + "/" +
            this.globalVars.currentModule + "/" + this.tabid;

        this.http.get(this.servicesUrl + params)
            .timeout(this.globalVars.requestTimeout)
            .retry(this.globalVars.retry)
            .subscribe(
            res => {
                if (res != undefined && res != null && res.json().length > 0) {
                    this.data = res.json();
                    resolve(this.data);
                    let storageData = { cacheTime: new Date().getTime(), data: this.data };
                    this.storage.set(this.storageKey, storageData);
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

    saveListDownloadingData(data) {
        this.storage.set(this.lstDownloadingStorageKey, data);
    }
}