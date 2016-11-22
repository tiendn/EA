"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var GlobalVars = (function () {
    function GlobalVars() {
        //Static variables
        this.serviceBaseUrl = "http://10.10.15.8/myirappapi2/";
        this.externalAccServiceUrl = "http://server.vn/myirappapi2/";
        this.apiPath = "api";
        this.apiVersion = "v1";
        this.retry = 3;
        this.tickerTimeInterval = 60000;
        this.currencyStorageTTL = 3600000;
        this.settingStorageTTL = 7200000;
        this.requestTimeout = 10000;
        this.decimalSeparator = [
            {
                name: "Comma",
                value: ","
            },
            {
                name: "Dot",
                value: "."
            }
        ];
        this.language = [
            {
                name: "English",
                value: "en-gb"
            },
            {
                name: "日本語",
                value: "ja-jp"
            },
            {
                name: "Pусский",
                value: "ru-ru"
            },
            {
                name: "Norsk",
                value: "nb-no"
            },
            {
                name: "Svenska",
                value: "sv-se"
            },
            {
                name: "Suomi",
                value: "fi-fi"
            },
            {
                name: "Dansk",
                value: "da-dk"
            },
            {
                name: "Español",
                value: "es-es"
            },
            {
                name: "Deutsch",
                value: "de-de"
            },
            {
                name: "Français",
                value: "fr-fr"
            },
            {
                name: "Íslenska",
                value: "is-is"
            },
            {
                name: "Italiano",
                value: "it-it"
            },
            {
                name: "Português",
                value: "pt-pt"
            },
            {
                name: "العربية",
                value: "ar-ae"
            },
            {
                name: "简体中文",
                value: "zh-cn"
            },
            {
                name: "繁體中文",
                value: "zh-tw"
            },
            {
                name: "한국어",
                value: "ko-kr"
            }
        ];
        this.useEasternArabicNumbers = true;
        this.sharegraph = {
            timeInterval: 60000,
            historyStorageTTL: 900000,
            intradayStorageTTL: 300000,
            performanceDataStorageTTL: 900000
        };
        this.calendar = {
            storageTTL: 300000
        };
        this.historicalprice = {
            storageTTL: 900000
        };
        this.pressreleases = {
            storageTTL: 300000
        };
        this.report = {
            storageTTL: 300000,
            downloadLimit: 10
        };
        this.httpRequestHeader = {
            headers: {
                'Authorization': "Basic bm9ybWFsdXNlcjpwNmVqYVByRQ=="
            }
        };
        this.servicesUrl = this.serviceBaseUrl + this.apiPath + "/" + this.apiVersion + "/";
        this.externalServiceUrl = this.externalAccServiceUrl + this.apiPath + "/" + this.apiVersion + "/";
        this.generalSettings = {
            language: {
                isDefault: true,
                value: "en-GB",
                name: "English"
            },
            separator: {
                isDefault: true,
                decimal: ".",
                thousand: ",",
                name: ""
            },
            decimalDigits: 2,
            currency: {
                isDefault: true,
                value: ""
            },
            quickMenu: {
                isDefault: true,
                customOrder: [],
                defaultOrder: []
            },
            menuImage: "image1",
            pushNotifications: {
                pressreleases: false,
                reports: false,
                media: false
            },
            shortDateFormat: "dd/mm/yyyy",
            longDateFormat: "dddd mmmm dd, yyyy",
            timeFormat: "hh:MM"
        };
        this.profileSettings = {
            showWatchlistIntroduction: false,
            showIndicesIntroduction: false,
            enableWatchlist: false,
            watchlist: [],
            enableIndices: false,
            indices: [],
            emailAlert: 0
        };
        this.isOnline = true;
        this.isArabic = false;
        this.isTablet = false;
        this.isNativeMode = false;
        this.isIOS = true;
        this.changedLanguage = false;
        this.changedDecimalSeparator = false;
        this.changedCurrency = false;
    }
    //Set global variables
    GlobalVars.prototype.setGlobalVar = function (key, value) {
        this[key] = value;
    };
    //Get dynamic global variables
    GlobalVars.prototype.getGlobalVar = function (key) {
        return this[key];
    };
    GlobalVars = __decorate([
        core_1.Injectable()
    ], GlobalVars);
    return GlobalVars;
}());
exports.GlobalVars = GlobalVars;
