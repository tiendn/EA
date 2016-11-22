"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AppConfigService = (function () {
    function AppConfigService(http, storage, globalVars) {
        this.http = http;
        this.storage = storage;
        this.globalVars = globalVars;
        this.configStorageKey = "appconfig";
        this.defaultSettingsStorageKey = "appdefaultsettings";
        this.userConfigStorageKey = "userconfig";
        this.appBuildVersionStorageKey = "buildversion";
        this.generalSettingStorageKey = "generalsettings";
    }
    //Get company data from company/settings.json
    AppConfigService.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get('assets/company/settings.json').subscribe(function (res) {
                _this.data = res.json();
                resolve(_this.data);
            }, function (error) {
                console.log(error);
                resolve(null);
            });
        });
    };
    //Check app version, if new => clear all storage
    AppConfigService.prototype.checkAppVersion = function (buildVersion) {
        var _this = this;
        this.storage.get(this.appBuildVersionStorageKey).then(function (data) {
            if (data != buildVersion) {
                _this.storage.clear();
                _this.storage.set(_this.appBuildVersionStorageKey, buildVersion);
            }
        });
    };
    //Get general settings from storage
    AppConfigService.prototype.getGeneralSettingsData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.storage.get(_this.generalSettingStorageKey).then(function (data) {
                if (data != null)
                    resolve(data);
                else
                    resolve(null);
            });
        });
    };
    //Set general settings to storage
    AppConfigService.prototype.setGeneralSettingsData = function () {
        if (this.globalVars.generalSettings)
            this.storage.set(this.generalSettingStorageKey, this.globalVars.generalSettings);
    };
    AppConfigService = __decorate([
        core_1.Injectable()
    ], AppConfigService);
    return AppConfigService;
}());
exports.AppConfigService = AppConfigService;
