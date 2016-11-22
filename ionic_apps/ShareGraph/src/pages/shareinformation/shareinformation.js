"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
//import { ScrollTabComponent } from '../../components/scrolltab/scrolltab';
var performance_service_1 = require('../../providers/performance-service');
var ShareInformationPage = (function () {
    function ShareInformationPage(helper, sanitizationService, view, globalVars, performanceService) {
        this.helper = helper;
        this.sanitizationService = sanitizationService;
        this.view = view;
        this.globalVars = globalVars;
        this.performanceService = performanceService;
        //@ViewChild(ScrollTabComponent) scrollTab: ScrollTabComponent;
        this.moduleName = "ShareInformation";
        this.shareInfoConfigData = this.globalVars.configData.shareinformation;
        this.loadPhrases();
    }
    ShareInformationPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.globalVars.currentModule = "shareinformation";
        //Back from settings page
        if (this.globalVars.changedLanguage && this.globalVars.changedLanguage == true) {
            this.view.setBackButtonText(this.helper.getPhrase("Back"));
            this.loadPhrases();
            var shareInfoConfig = this.shareInfoConfigData.filter(function (obj) { return obj.instrumentid == _this.currentTabData.id; });
            if (shareInfoConfig.length > 0) {
                this.shareinfoData.market = this.helper.getConfigValueByLang(shareInfoConfig[0].marketname);
            }
        }
        if (this.globalVars.changedDecimalSeparator && this.globalVars.changedDecimalSeparator == true) {
            var data_1 = this.shareinfoData;
            this.shareinfoData = [];
            setTimeout(function () {
                _this.shareinfoData = data_1;
            }, 100);
        }
        //if (irApp.changedLanguage && irApp.changedLanguage == true) {
        //    this.loadPhrases();
        //    this.selectedTab(this.currentTabData, true);
        //}
        //else if (irApp.changedCurrency && irApp.changedCurrency == true)
        //    this.selectedTab(this.currentTabData, true);
    };
    ShareInformationPage.prototype.ionViewDidLoad = function () {
        //this.scrollTab.genTabData(this, this.globalVars.configData.common.sharetypes);
        this.genTabData();
        this.currentTabData = this.globalVars.configData.common.sharetypes[0];
        this.currentTabData.id = this.currentTabData.instrumentid;
        this.selectedTab(this.currentTabData);
    };
    ShareInformationPage.prototype.ionViewDidEnter = function () {
        this.helper.checkAppStatus();
    };
    ShareInformationPage.prototype.genTabData = function () {
        var _this = this;
        if (this.globalVars.configData.common.sharetypes.length > 1) {
            var data = this.globalVars.configData.common.sharetypes.slice();
            data.forEach(function (obj) {
                obj.id = obj["instrumentid"];
                obj.displayName = _this.helper.getConfigValueByLang(obj.name);
            });
            this.tabData = data;
        }
    };
    ShareInformationPage.prototype.loadPhrases = function () {
        this.headerTitle = this.helper.getPhrase("ShareInformation", "Common");
        var currencyLabel = this.helper.getPhrase("Currency", this.moduleName);
        if (!this.globalVars.generalSettings.currency.isDefault) {
            currencyLabel += " <span class='currency-custom'>(" + this.helper.getPhrase("CustomCurrencyLabel", this.moduleName) + ")</span>";
        }
        var shareDataNote = this.helper.getPhrase("ShareDataDesc", this.moduleName);
        this.shareinfoListText = {
            shareinfoNote: this.sanitizationService.bypassSecurityTrustHtml(shareDataNote.replace("<a>", "<a class='link-to-settings' href='javascript:irApp.root.helper.goToSettings()'>")),
            marketHeader: this.helper.getPhrase("MarketInfo", this.moduleName),
            currency: this.sanitizationService.bypassSecurityTrustHtml(currencyLabel),
            market: this.helper.getPhrase("Market", this.moduleName),
            isin: this.helper.getPhrase("IsinCode", this.moduleName),
            symbol: this.helper.getPhrase("Symbol", this.moduleName),
            performanceHeader: this.helper.getPhrase("PerformanceInfo", this.moduleName),
            ytd: this.helper.getPhrase("YTDPercent", this.moduleName),
            week: this.helper.getPhrase("WeeksPercent52", this.moduleName),
            mHigh: this.helper.getPhrase("ThreeMonthHigh", this.moduleName),
            mLow: this.helper.getPhrase("ThreeMonthLow", this.moduleName)
        };
    };
    ShareInformationPage.prototype.selectedTab = function (sharetype, forceReload) {
        var _this = this;
        if (forceReload === void 0) { forceReload = false; }
        this.helper.checkTokenExpired();
        if (forceReload || (this.refresher != null || sharetype.id != this.currentInstrumentId)) {
            this.helper.showLoading(this);
            this.currentInstrumentId = sharetype.id;
            this.currentTabData = sharetype;
            this.performanceService.getPerformanceData(sharetype.id).then(function (data) {
                if (data != undefined && data != null) {
                    _this.shareinfoData = _this.processShareInfoData(data, sharetype.id);
                }
                else {
                    _this.createDefaultShareInfoData();
                }
                if (_this.refresher != null) {
                    _this.refresher.complete();
                    _this.refresher = null;
                }
                _this.helper.hideLoading(_this);
            });
        }
    };
    ShareInformationPage.prototype.createDefaultShareInfoData = function () {
        this.shareinfoData = {
            currency: "",
            market: "",
            isin: "",
            tLast: "",
            tPrevClose: "",
            t3mHigh: "",
            t3mLow: "",
            t52wHigh: "",
            t52wLow: "",
            t52wChange: "",
            tYTD: "",
            Symbol: "",
            List: "",
            Industry: "",
            NumberOfShares: "",
            NumberOfUnlistedShares: ""
        };
    };
    ShareInformationPage.prototype.processShareInfoData = function (data, instrumentId) {
        //Get currency
        if (this.globalVars.generalSettings.currency.isDefault) {
            var instrument = this.globalVars.configData.common.instruments.filter(function (instrument) { return instrument.instrumentid == instrumentId; });
            if (instrument.length > 0) {
                data.currency = instrument[0].currencycode;
            }
        }
        else {
            data.currency = this.globalVars.generalSettings.currency.value;
        }
        this.decimalDigits = this.helper.getDecimalDigits(data.currency);
        //Get currency name
        data.currency = this.helper.getCurrencyName(data.currency);
        //Get market name
        var shareInfoConfig = this.shareInfoConfigData.filter(function (obj) { return obj.instrumentid == instrumentId; });
        if (shareInfoConfig.length > 0) {
            data.market = this.helper.getConfigValueByLang(shareInfoConfig[0].marketname);
            data.isin = shareInfoConfig[0].isin;
            data.Symbol = shareInfoConfig[0].symbol;
        }
        else {
            data.market = "";
            data.isin = "";
            data.Symbol = "";
        }
        return data;
    };
    ShareInformationPage.prototype.doRefresh = function (refresher) {
        if (this.refresher == null) {
            this.refresher = refresher;
            this.selectedTab(this.currentTabData);
        }
    };
    ShareInformationPage = __decorate([
        core_1.Component({
            selector: 'page-shareinformation',
            templateUrl: 'shareinformation.html',
            //templateUrl: (function () {
            //    //alert(1);
            //    return '../../src/pages/shareinformation/shareinformation.html';
            //} ()),
            providers: [performance_service_1.PerformanceService]
        })
    ], ShareInformationPage);
    return ShareInformationPage;
}());
exports.ShareInformationPage = ShareInformationPage;
