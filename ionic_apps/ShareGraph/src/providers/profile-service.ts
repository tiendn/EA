import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/Rx';

@Injectable()
export class ProfileService {

    servicesUrl: string;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars) { }

    saveEmailAlertSetting(userData) {
        //let header = {
        //    headers: {
        //        'Authorization': "Bearer " + irApp.user.access_token,
        //        'Content-Type': 'application/x-www-form-urlencoded'
        //    }
        //};
        //this.servicesUrl = irApp.servicesUrl + "emailalert";
        ////this.setProfileData();

        //if (irApp.isOnline) {
        //    return new Promise(resolve => {
        //        this.http.post(this.servicesUrl, "Status=" + userData, header)
        //            .timeout(irApp.defaultSettings.common.requestTimeout)
        //            .retry(irApp.defaultSettings.common.retry)
        //            .subscribe(
        //            res => {
        //                if (res != undefined && res != null) {
        //                    resolve(true);
        //                }
        //                else
        //                    resolve(false);
        //            },
        //            error => {
        //                console.log(error);
        //                resolve(false);
        //            }
        //            );
        //    });
        //}
    }

    saveWatchlistSetting(apiName, userData) {
        //if (apiName) {
        //    if (apiName == "watchlist") {
        //        this.apiName = "profile/watchliststatus";
        //    }
        //    else if (apiName == "indices") {
        //        this.apiName = "profile/indicesstatus";
        //    }
        //}
        //let header = {
        //    headers: {
        //        'Authorization': "Bearer " + irApp.user.access_token,
        //        'Content-Type': 'application/x-www-form-urlencoded'
        //    }
        //};
        //this.servicesUrl = irApp.servicesUrl + this.apiName;
        ////this.setProfileData();

        //if (irApp.isOnline) {
        //    return new Promise(resolve => {
        //        this.http.post(this.servicesUrl, "Enabled=" + userData, header)
        //            .timeout(irApp.defaultSettings.common.requestTimeout)
        //            .retry(irApp.defaultSettings.common.retry)
        //            .subscribe(
        //            res => {
        //                if (res != undefined && res != null) {
        //                    resolve(true);
        //                }
        //                else
        //                    resolve(false);
        //            },
        //            error => {
        //                console.log(error);
        //                resolve(false);
        //            }
        //            );
        //    });
        //}
    }


    saveWatchlistData(apiName, userData) {
        //if (apiName) {
        //    this.apiName = apiName;
        //}
        //let header = {
        //    headers: {
        //        'Authorization': "Bearer " + irApp.user.access_token,
        //        'Content-Type': 'application/x-www-form-urlencoded'
        //    }
        //};

        //this.servicesUrl = irApp.servicesUrl + this.apiName;
        ////this.setProfileData();
        //if (irApp.isOnline) {
        //    return new Promise(resolve => {
        //        this.http.post(this.servicesUrl, "InstrumentIds=" + userData, header)
        //            .timeout(irApp.defaultSettings.common.requestTimeout)
        //            .retry(irApp.defaultSettings.common.retry)
        //            .subscribe(
        //            res => {
        //                if (res != undefined && res != null) {
        //                    resolve(true);
        //                }
        //                else
        //                    resolve(false);
        //            },
        //            error => {
        //                console.log(error);
        //                resolve(false);
        //            }
        //            );
        //    });
        //}
    }

    getSearchData(apiName, input, row) {
        //if (apiName) {
        //    this.apiName = apiName;
        //}
        //this.servicesUrl = irApp.servicesUrl + this.apiName + '/' + input + "/" + row;
        //if (irApp.isOnline) {
        //    return new Promise(resolve => {
        //        this.http.get(this.servicesUrl, irApp.httpRequestHeader)
        //            .timeout(irApp.defaultSettings.common.requestTimeout)
        //            .retry(irApp.defaultSettings.common.retry)
        //            .subscribe(
        //            res => {
        //                this.data = res.json();
        //                resolve(this.data);
        //            },
        //            error => {
        //                console.log(error);
        //            }
        //            );
        //    });
        //}
    }

    getCompareData(apiName, instrumentIds) {
        this.servicesUrl = this.globalVars.servicesUrl + apiName + "/compare/" + instrumentIds;
        if (this.globalVars.isOnline) {
            return new Promise(resolve => {
                this.http.get(this.servicesUrl)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                    res => {
                        resolve(res.json());
                    },
                    error => {
                        console.log(error);
                    }
                    );
            });
        }
    }

    getPerformanceData(apiName, instrumentIds) {
        this.servicesUrl = this.globalVars.servicesUrl + apiName + "/performance/" + instrumentIds;
        if (this.globalVars.isOnline) {
            return new Promise(resolve => {
                this.http.get(this.servicesUrl)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                        res => {
                            resolve(res.json());
                        },
                        error => {
                            console.log(error);
                        }
                    );
            });
        }
    }

    getProfileData() {
        //return new Promise(resolve => {
        //    //this.localStorage.get(this.profileSettingsStorageKey).then(data => {
        //    //    if(data != null){
        //    //        irApp.profileSettings = JSON.parse(data);
        //    //        //resolve(JSON.parse(data));
        //    //    }
        //    if (irApp.isOnline) {
        //        let header = {
        //            headers: {
        //                'Authorization': "Bearer " + irApp.user.access_token
        //            }
        //        };
        //        this.http.get(irApp.externalAccServiceUrl + 'profile/watchlistindices/', header).subscribe(
        //            res => {
        //                if (res != null) {
        //                    let pData = res.json();
        //                    irApp.profileSettings.watchlist = pData.watchlist == null ? [] : pData.watchlist;
        //                    irApp.profileSettings.indices = pData.indices == null ? [] : pData.indices;
        //                    //this.setProfileData();
        //                    //resolve(pData);
        //                }
        //            },
        //            error => {
        //                console.log(error);
        //                resolve(null);
        //                //this.getProfileDataFromStorage(resolve);
        //            }
        //        );
        //    }
        //    else
        //        resolve(null);
        //    //    });
        //});
    }

    getProfileDataFromStorage(resolve) {
        //this.localStorage.get(this.profileSettingsStorageKey).then(data => {
        //    if (data != null)
        //        resolve(JSON.parse(data));
        //    else
        //        resolve(null);
        //});
    }

    //setProfileData(){
    //    this.localStorage.set(this.profileSettingsStorageKey, JSON.stringify(irApp.profileSettings));
    //}

    getProfileStatus() {
        //return new Promise(resolve => {
        //    if (irApp.isOnline) {
        //        let servicesUrl = irApp.servicesUrl + "profile";
        //        let header = {
        //            headers: {
        //                'Authorization': "Bearer " + irApp.user.access_token
        //            }
        //        };
        //        this.http.get(servicesUrl, header)
        //            .timeout(irApp.defaultSettings.common.requestTimeout)
        //            .retry(irApp.defaultSettings.common.retry)
        //            .subscribe(
        //            res => {
        //                let data = res.json();
        //                irApp.profileSettings.enableWatchlist = data.Watchlist;
        //                irApp.profileSettings.enableIndices = data.Indices;
        //                irApp.profileSettings.emailAlert = data.EmailAlert;
        //                resolve(data);
        //            },
        //            error => {
        //                console.log(error);
        //                resolve(null);
        //            }
        //            );
        //    }
        //    else {
        //        resolve(null);
        //    }
        //});
    }

    //removeProfileData(){
    //    this.localStorage.remove(this.profileSettingsStorageKey);
    //}

    //Check enable|disable watchlist in settings
    //return true|false
    isEnabledWatchlist() {
        return true;//irApp.profileSettings.enableWatchlist == true;
    }

    //Check enable|disable indices in settings
    //return true|false
    isEnabledIndices() {
        return true;// irApp.profileSettings.enableIndices == true;
    }

    //Get watchlist data
    getWatchlistConfig() {
        return [];// irApp.profileSettings.watchlist;
    }

    //Get watchlist data
    getIndicesConfig() {
        return [];// irApp.profileSettings.indices;
    }

}