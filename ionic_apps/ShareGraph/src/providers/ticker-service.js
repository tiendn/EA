"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
require('rxjs/Rx');
var TickerService = (function () {
    function TickerService(http, storage, globalVars) {
        this.http = http;
        this.storage = storage;
        this.globalVars = globalVars;
        this.apiKey = "ticker";
    }
    TickerService.prototype.getTickerData = function () {
        var _this = this;
        this.servicesUrl = this.globalVars.servicesUrl + this.apiKey + '/' + this.globalVars.companyCode + "/";
        this.storageKey = this.apiKey + "_" + this.globalVars.generalSettings.currency.value;
        if (this.globalVars.isOnline) {
            var currency_1 = "";
            if (!this.globalVars.generalSettings.currency.isDefault) {
                currency_1 = this.globalVars.generalSettings.currency.value + "/";
            }
            return new Promise(function (resolve) {
                _this.http.get(_this.servicesUrl + currency_1)
                    .timeout(_this.globalVars.requestTimeout, new Error('timeout exceeded'))
                    .retry(_this.globalVars.retry)
                    .subscribe(function (res) {
                    _this.data = res.json();
                    resolve(_this.data);
                    _this.storage.set(_this.storageKey, _this.data);
                }, function (error) {
                    console.log(error);
                    _this.getTickerDataFromStorage(resolve);
                });
            });
        }
        else {
            return new Promise(function (resolve) {
                _this.getTickerDataFromStorage(resolve);
            });
        }
    };
    TickerService.prototype.getTickerDataFromStorage = function (resolve) {
        var _this = this;
        this.storage.get(this.storageKey).then(function (sData) {
            if (sData != null) {
                _this.data = sData;
                resolve(_this.data);
            }
            else {
                resolve([]);
            }
        });
    };
    TickerService = __decorate([
        core_1.Injectable()
    ], TickerService);
    return TickerService;
}());
exports.TickerService = TickerService;
