"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
require('rxjs/Rx');
var PerformanceService = (function () {
    function PerformanceService(http, storage, globalVars) {
        this.http = http;
        this.storage = storage;
        this.globalVars = globalVars;
        this.apiName = "performancedata";
        this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/" + this.globalVars.companyCode + "/";
    }
    PerformanceService.prototype.getPerformanceData = function (instrumentId) {
        var _this = this;
        this.storageKey = this.apiName + "_" + this.globalVars.generalSettings.language.value.toLowerCase() + "_" + this.globalVars.generalSettings.currency.value;
        return new Promise(function (resolve) {
            _this.storage.get(_this.storageKey).then(function (sdata) {
                if (sdata != null) {
                    var storageData = sdata;
                    var TTL = _this.globalVars.sharegraph.performanceDataStorageTTL;
                    if (TTL <= (new Date().getTime() - storageData.cacheTime)) {
                        _this.getPerformanceDataFromServices(resolve, instrumentId, null);
                    }
                    else {
                        if (storageData.data[instrumentId] != undefined && storageData.data[instrumentId] != null)
                            resolve(storageData.data[instrumentId]);
                        else
                            _this.getPerformanceDataFromServices(resolve, instrumentId, storageData);
                    }
                }
                else {
                    _this.getPerformanceDataFromServices(resolve, instrumentId, null);
                }
            });
        });
    };
    PerformanceService.prototype.getPerformanceDataFromServices = function (resolve, instrumentid, currentStorageData) {
        var _this = this;
        if (this.globalVars.isOnline) {
            var requestParams = instrumentid + "/" + this.globalVars.generalSettings.language.value;
            if (!this.globalVars.generalSettings.currency.isDefault)
                requestParams += "/" + this.globalVars.generalSettings.currency.value + "/";
            this.http.get(this.servicesUrl + requestParams)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(function (res) {
                if (res != undefined && res != null) {
                    var data = res.json();
                    var storageData = currentStorageData;
                    if (storageData == null)
                        storageData = { data: {}, cacheTime: new Date().getTime() };
                    storageData.data[instrumentid] = data;
                    _this.storage.set(_this.storageKey, storageData);
                    resolve(data);
                }
                else {
                    resolve([]);
                }
            }, function (error) {
                console.log(error);
                resolve([]);
            });
        }
        else {
            if (currentStorageData != null && currentStorageData.data[instrumentid] != undefined && currentStorageData.data[instrumentid] != null)
                resolve(currentStorageData.data[instrumentid]);
            else
                resolve([]);
        }
    };
    PerformanceService = __decorate([
        core_1.Injectable()
    ], PerformanceService);
    return PerformanceService;
}());
exports.PerformanceService = PerformanceService;
