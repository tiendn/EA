import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import 'rxjs/operator/timeout';
import 'rxjs/operator/retry';

@Injectable()
export class ProfileService {
    apiName = "watchlist";
    profileSettingsStorageKey = "profilesettings";
    servicesUrl: any;
    storageKey: any;
    data: any;
    constructor(public http: Http,
                public storage: Storage,
                public globalVars: GlobalVars) {
        this.servicesUrl = globalVars.servicesUrl + this.apiName + "/";
    }
    
    saveEmailAlertSetting(userData){
        this.servicesUrl = this.globalVars.servicesUrl + "emailalert";
        //this.setProfileData();
        if(this.globalVars.isOnline){
            let requestHeader:any = new Headers();
            if(this.globalVars.user)
                requestHeader.append('Authorization', 'Bearer '+ this.globalVars.user.access_token);

            return new Promise(resolve => {
                this.http.post(this.servicesUrl, "Status=" + userData, {headers: requestHeader})
                        .timeout(this.globalVars.requestTimeout)
                        .retry(this.globalVars.retry)
                        .subscribe(
                            res => {
                                if(res != undefined && res != null){
                                    resolve(true);
                                }
                                else
                                    resolve(false);
                            },
                            error => {
                                console.log(error);
                                resolve(false);
                            }
                        );
            });
        }
    }

    saveWatchlistSetting(apiName, userData){
        if(apiName){
            if(apiName=="watchlist"){
                this.apiName = "profile/watchliststatus";
            }
            else if(apiName=="indices"){
                this.apiName = "profile/indicesstatus";
            }
        }
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName;
        let requestHeader:any = new Headers();
        if(this.globalVars.user)
        {
            requestHeader.append('Authorization', 'Bearer '+ this.globalVars.user.access_token);
            requestHeader.append('Content-Type', 'application/x-www-form-urlencoded');
        }
            
        if(this.globalVars.isOnline){
            return new Promise(resolve => {
                this.http.post(this.servicesUrl, "Enabled=" + userData, {headers: requestHeader})
                        .timeout(this.globalVars.requestTimeout)
                        .retry(this.globalVars.retry)
                        .subscribe(
                            res => {
                                if(res != undefined && res != null){
                                    resolve(true);
                                }
                                else
                                    resolve(false);
                            },
                            error => {
                                console.log(error);
                                resolve(false);
                            }
                        );
            });
        }
    }


    saveWatchlistData(apiName, userData){
        if(apiName){
            this.apiName = apiName;
        }

        this.servicesUrl = this.globalVars.servicesUrl + this.apiName;
        let requestHeader:any = new Headers();
        if(this.globalVars.user)
        {
            requestHeader.append('Authorization', 'Bearer '+ this.globalVars.user.access_token);
            requestHeader.append('Content-Type', 'application/x-www-form-urlencoded');
        }

        if(this.globalVars.isOnline){
            return new Promise(resolve => {
                this.http.post(this.servicesUrl, "InstrumentIds=" + userData, {headers: requestHeader})
                        .timeout(this.globalVars.requestTimeout)
                        .retry(this.globalVars.retry)
                        .subscribe(
                            res => {
                                if(res != undefined && res != null){
                                    resolve(true);
                                }
                                else
                                    resolve(false);
                            },
                            error => {
                                console.log(error);
                                resolve(false);
                            }
                        );
            });
        }
    }

    getSearchData(apiName, input, row) {
        if(apiName){
            this.apiName = apiName;
        }
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + '/' + input + "/"+ row;
        if(this.globalVars.isOnline){
            return new Promise(resolve => {
                this.http.get(this.servicesUrl)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                        res => {
                            this.data = res.json();
                            resolve(this.data);
                        }, 
                        error =>{
                            console.log(error);
                        }
                    );
            });
        }
    }
    
    getCompareData(apiName, instrumentIds)
    {
        if(apiName){
            this.apiName = apiName;
        }
        
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/compare/"+ instrumentIds;
        if(this.globalVars.isOnline){
            return new Promise(resolve => {
                this.http.get(this.servicesUrl)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                        res => {
                            this.data = res.json();
                            resolve(this.data);
                        }, 
                        error =>{
                            console.log(error);
                        }
                    );
            });
        }
    }

    getPerformanceData(apiName, instrumentIds)
    {
        if(apiName){
            this.apiName = apiName;
        }

        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/performance/"+ instrumentIds;
        if(this.globalVars.isOnline){
            return new Promise(resolve => {
                this.http.get(this.servicesUrl)
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                        res => {
                            this.data = res.json();
                            resolve(this.data);
                        }, 
                        error =>{
                            console.log(error);
                        }
                    );
            });
        }
    }

    getProfileData(){
        return new Promise(resolve => {
            //this.localStorage.get(this.profileSettingsStorageKey).then(data => {
            //    if(data != null){
            //        irApp.profileSettings = JSON.parse(data);
            //        //resolve(JSON.parse(data));
            //    }
            if(this.globalVars.isOnline){
                let requestHeader:any = new Headers(); 
                if(this.globalVars.user)
                    requestHeader.append('Authorization', 'Bearer '+ this.globalVars.user.access_token);

                this.http.get(this.globalVars.externalServiceUrl + 'profile/watchlistindices/', {headers: requestHeader}).subscribe(
                    res => {
                        if(res != null){
                            let pData = res.json();
                            this.globalVars.profileSettings.watchlist = pData.watchlist == null ? [] : pData.watchlist;
                            this.globalVars.profileSettings.indices = pData.indices == null ? [] : pData.indices;
                            //this.setProfileData();
                            //resolve(pData);
                        }
                    },
                    error => {
                        console.log(error);
                        resolve(null);
                        //this.getProfileDataFromStorage(resolve);
                    }
                );     
            }
            else
                resolve(null);
        //    });
        });
    }

    getProfileDataFromStorage(resolve){
        this.storage.get(this.profileSettingsStorageKey).then(data => {
            if(data != null)
                resolve(JSON.parse(data));
            else
                resolve(null);
        });
    }

    //setProfileData(){
    //    this.localStorage.set(this.profileSettingsStorageKey, JSON.stringify(irApp.profileSettings));
    //}

    getProfileStatus(){
        return new Promise(resolve => {
            if(this.globalVars.isOnline){
                let servicesUrl = this.globalVars.servicesUrl + "profile";
                let requestHeader:any = new Headers(); 
                if(this.globalVars.user)
                    requestHeader.append('Authorization', 'Bearer '+ this.globalVars.user.access_token);

                this.http.get(servicesUrl, {headers: requestHeader})
                    .timeout(this.globalVars.requestTimeout)
                    .retry(this.globalVars.retry)
                    .subscribe(
                        res => {
                            let data = res.json();
                            this.globalVars.profileSettings.enableWatchlist = data.Watchlist;
                            this.globalVars.profileSettings.enableIndices = data.Indices;
                            this.globalVars.profileSettings.emailAlert = data.EmailAlert;
                            resolve(data);
                        }, 
                        error =>{
                            console.log(error);
                            resolve(null);
                        }
                    );
            }
            else{
                resolve(null);
            }
        });
    }

    //removeProfileData(){
    //    this.localStorage.remove(this.profileSettingsStorageKey);
    //}

    //Check enable|disable watchlist in settings
    //return true|false
    isEnabledWatchlist(){
        return true;// this.globalVars.profileSettings.enableWatchlist == true;
    }

    //Check enable|disable indices in settings
    //return true|false
    isEnabledIndices(){
        return true;// this.globalVars.profileSettings.enableIndices == true;
    }

    //Get watchlist data
    getWatchlistConfig(){
        return this.globalVars.profileSettings.watchlist;
    }

    //Get watchlist data
    getIndicesConfig(){
        return this.globalVars.profileSettings.indices;
    }
}