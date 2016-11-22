import { Component, ViewChild } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
//import { ScrollTabComponent } from '../../components/scrolltab/scrolltab';
import { PerformanceService } from '../../providers/performance-service';

@Component({
    selector: 'page-shareinformation',
    templateUrl: 'shareinformation.html',
    //templateUrl: (function () {
    //    //alert(1);
    //    return '../../src/pages/shareinformation/shareinformation.html';
    //} ()),
    providers: [PerformanceService]
})
export class ShareInformationPage {
    //@ViewChild(ScrollTabComponent) scrollTab: ScrollTabComponent;
    moduleName: string = "ShareInformation";
    refresher: any;
    shareInfoConfigData: any;
    currentTabData: any;
    shareinfoData: any;
    headerTitle: string;
    shareinfoListText: any;
    decimalDigits: number;
    tabData: any;
    currentInstrumentId: number;

    constructor(public helper: Helper, public sanitizationService: DomSanitizer, public view: ViewController, public globalVars: GlobalVars, public performanceService: PerformanceService) {
        this.shareInfoConfigData = this.globalVars.configData.shareinformation;
        this.loadPhrases();
    }

    ionViewWillEnter() {
        this.globalVars.currentModule = "shareinformation";
        //Back from settings page
        if (this.globalVars.changedLanguage && this.globalVars.changedLanguage == true) {
            this.view.setBackButtonText(this.helper.getPhrase("Back"));
            this.loadPhrases();
            let shareInfoConfig = this.shareInfoConfigData.filter(obj => obj.instrumentid == this.currentTabData.id);
            if (shareInfoConfig.length > 0) {
                this.shareinfoData.market = this.helper.getConfigValueByLang(shareInfoConfig[0].marketname);
            }
        }
        if (this.globalVars.changedDecimalSeparator && this.globalVars.changedDecimalSeparator == true) {
            let data = this.shareinfoData;
            this.shareinfoData = [];
            setTimeout(() => {
                this.shareinfoData = data;
            }, 100);
        }
        //if (irApp.changedLanguage && irApp.changedLanguage == true) {
        //    this.loadPhrases();
        //    this.selectedTab(this.currentTabData, true);
        //}
        //else if (irApp.changedCurrency && irApp.changedCurrency == true)
        //    this.selectedTab(this.currentTabData, true);
    }

    ionViewDidLoad() {
        //this.scrollTab.genTabData(this, this.globalVars.configData.common.sharetypes);
        this.genTabData();
        this.currentTabData = this.globalVars.configData.common.sharetypes[0];
        this.currentTabData.id = this.currentTabData.instrumentid;
        this.selectedTab(this.currentTabData);
    }

    ionViewDidEnter() {
        this.helper.checkAppStatus();
    }

    genTabData() {
        if (this.globalVars.configData.common.sharetypes.length > 1) {
            let data = this.globalVars.configData.common.sharetypes.slice();
            data.forEach((obj) => {
                obj.id = obj["instrumentid"];
                obj.displayName = this.helper.getConfigValueByLang(obj.name);
            });
            this.tabData = data;
        }
    }

    loadPhrases() {
        this.headerTitle = this.helper.getPhrase("ShareInformation", "Common");
        let currencyLabel = this.helper.getPhrase("Currency", this.moduleName);
        if (!this.globalVars.generalSettings.currency.isDefault) {
            currencyLabel += " <span class='currency-custom'>(" + this.helper.getPhrase("CustomCurrencyLabel", this.moduleName) + ")</span>";
        }
        let shareDataNote = this.helper.getPhrase("ShareDataDesc", this.moduleName);
        this.shareinfoListText = {
            shareinfoNote: this.sanitizationService.bypassSecurityTrustHtml(shareDataNote.replace("<a>", "<a class='link-to-settings' href='javascript:document.getElementById(\"btn_gotosettings\").click();'>")),
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
    }

    selectedTab(sharetype, forceReload = false) {
        this.helper.checkTokenExpired();
        if (forceReload || (this.refresher != null || sharetype.id != this.currentInstrumentId)) {
            this.helper.showLoading(this);
            this.currentInstrumentId = sharetype.id;
            this.currentTabData = sharetype;
            this.performanceService.getPerformanceData(sharetype.id).then(data => {
                if (data != undefined && data != null) {
                    this.shareinfoData = this.processShareInfoData(data, sharetype.id);
                }
                else {
                    this.createDefaultShareInfoData();
                }
                if (this.refresher != null) {
                    this.refresher.complete();
                    this.refresher = null;
                }
                this.helper.hideLoading(this);
            });
        }
    }

    createDefaultShareInfoData() {
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
    }

    processShareInfoData(data, instrumentId) {
        //Get currency
        if (this.globalVars.generalSettings.currency.isDefault) {
            let instrument = this.globalVars.configData.common.instruments.filter(instrument => instrument.instrumentid == instrumentId);
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
        let shareInfoConfig = this.shareInfoConfigData.filter(obj => obj.instrumentid == instrumentId);
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
    }

    doRefresh(refresher) {
        if (this.refresher == null) {
            this.refresher = refresher;
            this.selectedTab(this.currentTabData);
        }
    }

    goToSettingsPage() {
        this.helper.goToSettings();
    }
}
