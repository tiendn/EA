import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import { Helper } from '../common/helper';
import 'rxjs/Rx';

@Injectable()
export class PressReleasesService {
    apiName = "pressreleases";
    servicesUrl: any;
    storageKey: any;
    storageData: any;
    pagesize: number;
    lastDateNumeric: number;
    removeIds: any;
    data: any;
    searchData: any;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars, public helper: Helper) {
        this.servicesUrl = globalVars.servicesUrl + this.apiName + "/";
    }

    getPRData(pagesize, lastDateNumeric = 0, removeIds = "", keyword = "") {
        this.storageKey = this.apiName + "_" + this.globalVars.generalSettings.language.value.toLowerCase();
        this.pagesize = pagesize;
        this.lastDateNumeric = lastDateNumeric;
        this.removeIds = removeIds;
        return new Promise(resolve => {
            if (keyword.length > 0) {
                this.searchPRData(resolve, keyword);
            }
            else {
                this.storage.get(this.storageKey).then((sData) => {
                    if (sData != null) {
                        var storageData = sData;
                        this.storageData = storageData.data;
                        var TTL = this.globalVars.pressreleases.storageTTL;
                        if (TTL <= (new Date().getTime() - storageData.cacheTime)) {
                            this.getPRDataFromServices(resolve);
                        }
                        else {
                            this.getPRDataFromStorage(resolve);
                        }
                    }
                    else {
                        this.getPRDataFromServices(resolve);
                    }
                });
            }
        });
    }

    getPRDataFromStorage(resolve) {
        var arrIds = this.removeIds.split(",");
        var dataFilter = this.storageData.filter(obj => obj.DateNumeric <= this.lastDateNumeric && arrIds.indexOf(obj.Id.toString()) < 0);
        if (dataFilter.length > 0) {
            if (dataFilter.length >= this.pagesize) {
                this.data = dataFilter.slice(0, this.pagesize);
                resolve(this.data);
            }
            else {
                this.storageData.slice(0, -dataFilter.length);
                this.getPRDataFromServices(resolve);
            }
        }
        else {
            this.getPRDataFromServices(resolve);
        }
    }

    getPRDataFromServices(resolve) {
        if (this.globalVars.isOnline) {
            var params = this.globalVars.companyCode + "/" + this.globalVars.generalSettings.language.value + "/" + this.pagesize * 3 + "/" + this.lastDateNumeric;
            /*if(this.lastDateNumeric > 0)
                params += "/" + this.lastDateNumeric;*/
            if (this.removeIds != "")
                params += "/" + this.removeIds;
            let $scope = this;
            this.http.get(this.servicesUrl + params)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        var data = res.json();
                        if (data.length > 0) {
                            $scope.data = data.slice();
                            if ($scope.lastDateNumeric == 0) {
                                $scope.data = $scope.data.slice(0, $scope.pagesize);
                            }
                            resolve($scope.data);
                            var sData = { cacheTime: new Date().getTime() };
                            if ($scope.lastDateNumeric > 0 && $scope.storageData != null) {
                                sData["data"] = $scope.storageData.concat(data);
                            }
                            else {
                                sData["data"] = data;
                            }
                            $scope.storage.set($scope.storageKey, sData);
                        }
                        else {
                            resolve([]);
                        }
                    }
                },
                error => {
                    console.log(error);
                    resolve([]);
                }
                );
        }
        else {
            resolve([]);
        }
    }

    searchPRData(resolve, keyword) {
        if (this.searchData && this.searchData.length > 0) {
            if (this.searchData.length >= this.pagesize) {
                resolve(this.searchData.splice(0, this.pagesize));
            }
            else {
                resolve(this.searchData);
                this.searchData = [];
            }
        }
        else {
            var params = this.globalVars.companyCode + "/" + this.globalVars.generalSettings.language.value + "/" + this.pagesize * 3 + "/a/" + this.lastDateNumeric;
            if (this.removeIds != "")
                params += "/" + this.removeIds;
            params += "?keyword=" + encodeURIComponent(keyword.trim());
            this.http.get(this.servicesUrl + params).subscribe(res => {
                if (res != undefined && res != null) {
                    var data = res.json();
                    if (data.length > 0) {
                        this.searchData = data;
                        if (data.length >= this.pagesize) {
                            resolve(data.splice(0, this.pagesize));
                            this.searchData = data;
                        }
                        else {
                            this.searchData = [];
                            resolve(data);
                        }
                    }
                    else {
                        this.searchData = [];
                        resolve(data);
                    }
                }
            });
        }
    }

    getPRDetail(prId) {
        return new Promise(resolve => {
            //this.http.get("https://tools.euroland.com/tools/nativeirservices/api/v6/pressreleases/" + prId, irApp.httpRequestHeader).subscribe(res => {
            this.http.get(this.servicesUrl + prId).subscribe(res => {
                if (res != undefined && res != null)
                    resolve(res.json());
            });
        });
    }

    getPressReleasesByDate(sDate, eDate) {
        var params = this.globalVars.companyCode + "/" + this.globalVars.generalSettings.language.value + "/" + sDate + "/" + eDate;
        return new Promise(resolve => {
            this.http.get(this.servicesUrl + params).subscribe(res => {
                if (res != undefined && res != null)
                    resolve(res.json());
                else
                    resolve([]);
            });
        });
    }

    get1DChangeData(ids, date) {
        let params = ids + "/" + date;
        return new Promise(resolve => {
            this.http.get(this.servicesUrl + "1dchange/" + params).subscribe(res => {
                if (res != undefined && res != null)
                    resolve(res.json());
                else
                    resolve([]);
            });
        });
    }
}