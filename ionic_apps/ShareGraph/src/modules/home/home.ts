import { Component, Renderer, ViewChild } from '@angular/core';
import { NavController, Platform, MenuController, ModalController, Slides } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing, Globalization, Deeplinks, Splashscreen } from 'ionic-native';

import { GlobalVars } from '../../common/global-vars';
import { AppConfigService } from '../../providers/appconfig-service';
import { TranslationService } from '../../providers/translation-service';
import { ProfileService } from '../../providers/profile-service';
import { Helper } from '../../common/helper';
import { TickerService } from '../../providers/ticker-service';
import { ChartService } from '../../providers/chart-service';
import { AuthService } from '../../providers/auth-service';
import { DownloadService } from '../../providers/download-service';
import { ChangePasswordPage } from '../settings/profile/account/changepassword/changepassword';
import { ConfirmDownloadPage } from '../startdownload/confirmdownload/confirmdownload';
import { StartDownloadPage } from '../startdownload/startdownload';

declare var Highcharts: any;
declare var buildVersion: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [TickerService, ChartService, DownloadService]
})
export class HomePage {
    @ViewChild('tickerSlider') slider: Slides;
    tickerSlideOptions = {
        loop: true,
        pager: false
    };
    platform: any;
    isOnline: boolean = true;
    tickerLoaded: boolean = true;
    isTablet: boolean;
    refresher: any;
    tickerPhrases: {};
    homePageTitle: string;
    messNoData: string;
    moduleNote: any;
    chartPeriod: number;
    priceChartColor: string;
    dateFormatWithoutYear: string;
    instruments: Array<Object>;
    modules: Array<Object>;
    modulesDisplayName: Object;
    appFooter: any;
    tickers: Array<Object> = [];
    activeTicker: Object;
    activeTickerIndex: number;
    tickerInterval: any;
    currentDecimalDigits: number;
    charts: any;
    chartOptions: any;
    isShowTickerMess: boolean = false;

    constructor(platform: Platform, public navCtrl: NavController, public domSanitizer: DomSanitizer,
        public globalVars: GlobalVars, public menu: MenuController,
        public appConfigService: AppConfigService, public translationService: TranslationService,
        public helper: Helper, public tickerService: TickerService, public chartService: ChartService, public authService: AuthService,
        public profileService: ProfileService, public downloadservice: DownloadService, public modalCtrl: ModalController, public renderer: Renderer) {
        this.platform = platform;
        appConfigService.checkAppVersion(buildVersion);
        this.globalVars.homepage = this;
    }

    /*Page Life Circle*/
    ionViewWillEnter() {
        
        this.globalVars.currentModule = "home";

        this.setUserText();

        if (this.globalVars.isChangeLayout) {
            let slides = document.getElementsByClassName("swiper-wrapper")[0];
            if (slides.className.indexOf("changed-layout") >= 0)
                slides.className = slides.className.replace("changed-layout", "").trim();
            else
                slides.className += " changed-layout";
            this.globalVars.isChangeLayout = false;
        }

        if (this.globalVars.changedLanguage && this.globalVars.changedLanguage == true) {
            this.loadAllPhrasesInPage();
            this.getModuleDisplayName();
            this.globalVars.changedLanguage = false;
            if (!this.globalVars.changedCurrency) {
                //this.tickers = [];
                this.getTickerData();
            }
        }
        if (this.globalVars.changedCurrency && this.globalVars.changedCurrency == true) {
            this.tickerLoaded = false;
            this.globalVars.changedCurrency = false;
            this.getTickerData();
            this.globalVars.changedDecimalSeparator = false;
        }
        else if (this.globalVars.changedDecimalSeparator && this.globalVars.changedDecimalSeparator == true) {
            let tickerData = this.tickers;
            this.tickers = [];
            setTimeout(() => {
                this.tickers = tickerData;
            }, 100);
            this.globalVars.changedDecimalSeparator = false;
        }
    }

    ionViewDidLoad() {        
        this.authService.getUserData().then(data => {
            if (data != null) {
                this.globalVars.user = data;
                this.profileService.getProfileStatus();
                this.profileService.getProfileData();
            }
        });
        this.appConfigService.load().then(data => {
            this.globalVars.configData = data;
            //Get companycode
            this.globalVars.companyCode = data["companycode"];

            this.appConfigService.getGeneralSettingsData().then(data => {
                if (data != null)
                    this.globalVars.generalSettings = data;
                else
                    this.appConfigService.setGeneralSettingsData();
                    
                this.loadAppSettings();

                let self=this;
                this.downloadservice.getDownloadQueue().then(data=>{
                    if(data)
                    {
                        let queue = JSON.parse(data.toString());
                        
                        let dataLength = 0;
                        queue.forEach((item)=>{
                            dataLength += item.FileSize;
                        });
                        if(queue && queue.length>0)
                        {
                            //self.downloadservice: DownloadServices.startDownloadInBackground(queue);
                            self.confirmStartDownload(Math.round(dataLength*100)/100);
                        }
                    }
                    else
                    {
                        this.downloadservice.getStartDownloadLength().then(data=>{
                            if(data)
                            {
                                if(data>0)
                                {
                                    this.confirmStartDownload(data);
                                }
                            }
                        })
                    }
                })
            });
        });
        
        //this.setTickerInterval();
        //this.menu.enable(true, "irapp-leftmenu");
        //if (this.globalVars.phrasesData != null)
        //    this.helper.checkAppStatus();
    }

    ionViewDidEnter() {
        this.setTickerInterval();
        this.menu.enable(true, "irapp-leftmenu");
        if (this.globalVars.phrasesData != null)
            this.helper.checkAppStatus();
    }

    confirmStartDownload(data){
        let downloadModal = this.modalCtrl.create(ConfirmDownloadPage, {length: data});
        downloadModal.onDidDismiss(data => {
            if(data && data.isStarting)
            {
                this.modalCtrl.create(StartDownloadPage).present();
            }
        });
        downloadModal.present();
    }

    ionViewDidLeave() {
        if (this.tickerInterval != null) {
            clearInterval(this.tickerInterval);
            this.tickerInterval = null;
        }
        this.menu.enable(false, "irapp-leftmenu");
    }
    /*End Page Life Circle*/

    doRefresh(refresher) {
        if (this.refresher == null) {
            this.refresher = refresher;
            this.getTickerData();
        }
    }

    loadAllPhrasesInPage() {
        this.tickerPhrases = {
            open: this.helper.getPhrase("Open", "Common"),
            volume: this.helper.getPhrase("Volume", "Common"),
            hight: this.helper.getPhrase("High", "Common"),
            low: this.helper.getPhrase("Low", "Common"),
            note: this.helper.getPhrase("MessDataDelayed", "Common")
        }
        this.globalVars.root.settingsText = this.helper.getPhrase("Settings", "Common");
        this.homePageTitle = this.helper.getConfigData("common", "companyname", true);
        this.messNoData = this.helper.getPhrase("MsgNoData", "Common");
        //Gen Modules
        this.moduleNote = this.domSanitizer.bypassSecurityTrustHtml(this.helper.getPhrase("MenuDesc", "Common"));//.replace("<a>","<a class='link-to-settings' href='javascript:irApp.root.helper.goToSettings()'>"));
        this.SetFooterText();
    }

    /*-----Get App Settings-----*/
    loadAppSettings() {
        //this.isOnline = false;
        //Check if isDefault => get language from device
        this.platform.ready().then(() => {
            if (this.globalVars.isNativeMode) {
                this.isOnline = this.globalVars.isOnline;
                //this.bindNetworkStateEvent();

                //register Deeplinks
                //this.registerDeeplinks();

                if (this.globalVars.generalSettings.language.isDefault) {
                    Globalization.getPreferredLanguage().then(lang => {
                        if (lang != null && lang.value.length > 0) {
                            this.globalVars.generalSettings.language.value = this.helper.getLanguageCode(lang.value.toLowerCase());
                            this.loadPhrasesData(this.globalVars.generalSettings.language.value);
                        }
                        else {
                            this.globalVars.generalSettings.language.value = "en-gb";
                            this.loadPhrasesData(this.globalVars.generalSettings.language.value);
                        }
                    });
                }// else load language from obj
                else
                    this.loadPhrasesData(this.globalVars.generalSettings.language.value);

                //Load ticker
                //Get Number Pattern from device
                if (this.globalVars.generalSettings.separator.isDefault) {
                    Globalization.getNumberPattern({ type: 'decimal' }).then(pattern => {
                        let decimalseparator = pattern.decimal;
                        let thousandseparator = pattern.grouping;
                        if (decimalseparator != "," && decimalseparator != ".") {
                            thousandseparator = ",";
                            decimalseparator = ".";
                        }
                        this.globalVars.generalSettings.separator.decimal = decimalseparator;
                        this.globalVars.generalSettings.separator.thousand = thousandseparator;
                    });
                }
                //Get short date pattern from device
                Globalization.getDatePattern({ formatLength: 'short', selector: 'date' }).then(date => {
                    this.globalVars.generalSettings.shortDateFormat = this.helper.convertJSDatePattern(date.pattern, true);
                });
                //Get time pattern from device
                Globalization.getDatePattern({ formatLength: 'short', selector: 'time' }).then(time => {
                    this.globalVars.generalSettings.timeFormat = this.helper.convertJSDatePattern(time.pattern, false);
                    //this.getTickerData();
                });
                //Get long date pattern from device
                Globalization.getDatePattern({ formatLength: 'long', selector: 'date' }).then(date => {
                    this.globalVars.generalSettings.longDateFormat = this.helper.convertJSDatePattern(date.pattern, true);
                    //this.genHomePageContent();
                    //this.getTickerData();
                });
            }
            else {
                this.loadPhrasesData(this.globalVars.generalSettings.language.value);
            }
        });
    }

    registerDeeplinks() {
        Deeplinks.routeWithNavController(this.navCtrl, {
            '/account/resetpassword/:code': ChangePasswordPage
        }).subscribe((match) => {
            //console.log(match);
            if (match.$link.url.toLowerCase().indexOf("myir://account/resetpassword/") >= 0 && match.$link.queryString.length > 0) {
                let queryString = match.$link.queryString.split("&");
                let email = decodeURIComponent(queryString[0].split("=")[1]);
                let code = decodeURIComponent(queryString[1].split("=")[1]);
                this.navCtrl.push(ChangePasswordPage, { resetPassData: { email: email, resetCode: code } });
            }
        }, (nomatch) => {
        });
    }

    loadPhrasesData(lang) {
        if (lang.indexOf("zh") < 0) {
            if (lang.indexOf("-") > 0)
                lang = lang.split("-")[0];
        }
        this.platform.setLang(lang);
        if (lang.indexOf("ar") >= 0) {
            this.platform.setDir("rtl");
            this.globalVars.isArabic = true;
            this.globalVars.root.menuSide = "right";
        }
        else {
            this.platform.setDir("ltr");
            this.globalVars.isArabic = false;
            this.globalVars.root.menuSide = "left";
        }

        this.translationService.load(lang).then(data => {
            this.globalVars.phrasesData = data;
            if (!this.isOnline)
                this.helper.createOffileMess();
            this.helper.checkTokenExpired();
            this.helper.setConfig("backButtonText", this.helper.getPhrase("Back"), "ios");
            this.loadAllPhrasesInPage();
            //Get period for chart in home for tablet layout
            if (this.globalVars.isTablet) {
                if (this.globalVars.configData.home && this.globalVars.configData.home.graphperiod)
                    this.chartPeriod = this.helper.getDefaultChartPeriod(this.globalVars.configData.home.graphperiod.toLowerCase());
                else
                    this.chartPeriod = 1;
                this.priceChartColor = !this.globalVars.configData.sharegraph.pricechartcolor ? '#7EBFEA' : this.globalVars.configData.sharegraph.pricechartcolor;
                this.dateFormatWithoutYear = this.helper.getDateFormatWithoutYear();
            }
            this.getTickerData();
            this.genHomePageContent();
            this.helper.updateDateTimeConfig();
            this.setTickerInterval();
        });
    }

    getNumberSeparatorFromDevice() {
        if (this.globalVars.generalSettings.separator.isDefault) {
            Globalization.getNumberPattern({ type: 'decimal' }).then(pattern => {
                let decimalseparator = pattern.decimal;
                let thousandseparator = pattern.grouping;
                if (decimalseparator != "," && decimalseparator != ".") {
                    thousandseparator = ",";
                    decimalseparator = ".";
                }
                this.globalVars.generalSettings.separator.decimal = decimalseparator;
                this.globalVars.generalSettings.separator.thousand = thousandseparator;
                this.getShortDatePatternFromDevice();
            });
        }
        else {
            this.getShortDatePatternFromDevice();
        }
    }

    getShortDatePatternFromDevice() {
        Globalization.getDatePattern({ formatLength: 'short', selector: 'date' }).then(date => {
            this.globalVars.generalSettings.shortDateFormat = this.helper.convertJSDatePattern(date.pattern, true);
            this.getTimePatternFromDevice();
        });
    }

    getTimePatternFromDevice() {
        Globalization.getDatePattern({ formatLength: 'short', selector: 'time' }).then(time => {
            this.globalVars.generalSettings.timeFormat = this.helper.convertJSDatePattern(time.pattern, false);
            this.getLongDatePatternFromDevice();
        });
    }

    getLongDatePatternFromDevice() {
        Globalization.getDatePattern({ formatLength: 'long', selector: 'date' }).then(date => {
            this.globalVars.generalSettings.longDateFormat = this.helper.convertJSDatePattern(date.pattern, true);
            this.getTickerData();
        });
    }
    /*-----End Get App Settings-----*/

    genHomePageContent() {
        this.setUserText();
        this.loadAllPhrasesInPage();
        this.getModuleDisplayName();
        this.getTickerData();

        this.appConfigService.setGeneralSettingsData();

        //this.appConfigServices.setUserConfigData();
        //this.localStorage.set(this.appSettingsStorageKey, JSON.stringify(irApp.appSettingsData));
        this.instruments = this.globalVars.configData.common.instruments;

        if (this.instruments.length > 1)
            this.tickerSlideOptions.pager = true;

        this.getModuleDisplayName();
        this.getModules();

        //register Deeplinks
        this.registerDeeplinks();
    }

    setUserText() {
        if (this.globalVars.root) {
            if (this.authService.hasLoggedIn()) {
                this.globalVars.root.userText = this.authService.getUserName();
            }
            else {
                this.globalVars.root.userText = this.helper.getPhrase("Login");
            }
        }
    }

    getModules() {
        //Get default module in config
        let arrModule = [];
        let arrAllModule = [];
        if (this.globalVars.configData.common.modules) {
            if (!this.globalVars.isTablet) {
                for (let key in this.globalVars.configData.common.modules) {
                    let displayName = this.helper.getDisplayModuleName(key);
                    let moduleComponent = this.helper.getPage(key);
                    arrAllModule.push({ moduleName: key, displayName: displayName, component: moduleComponent });
                    if (this.globalVars.configData.common.modules[key].phone == true) {
                        arrModule.push({ moduleName: key, displayName: displayName, orientation: "portrait", component: moduleComponent });
                    }
                }
            }
            else {
                for (let key in this.globalVars.configData.common.modules) {
                    let displayName = this.helper.getDisplayModuleName(key);
                    let moduleComponent = this.helper.getPage(key);
                    arrAllModule.push({ moduleName: key, displayName: displayName, component: moduleComponent });
                    let orientation = "";
                    if (this.globalVars.configData.common.modules[key].portrait == true && this.globalVars.configData.common.modules[key].landscape == true) {
                        orientation = "all";
                    }
                    else {
                        if (this.globalVars.configData.common.modules[key].portrait === true)
                            orientation = "portrait";
                        else if (this.globalVars.configData.common.modules[key].landscape === true)
                            orientation = "landscape";
                    }
                    if (orientation.length > 0)
                        arrModule.push({ moduleName: key, displayName: displayName, orientation: orientation, component: moduleComponent });
                }
            }
            this.globalVars.root.leftMenuModules = arrAllModule;
            this.globalVars.generalSettings.quickMenu.defaultOrder = arrModule;
        }
        if (!this.globalVars.generalSettings.quickMenu.isDefault && this.globalVars.generalSettings.quickMenu.customOrder.length > 0) {
            this.globalVars.generalSettings.quickMenu.customOrder.forEach((obj) => {
                obj.displayName = this.helper.getDisplayModuleName(obj.moduleName);
                obj.component = this.helper.getPage(obj.moduleName);
            });
            this.modules = this.globalVars.generalSettings.quickMenu.customOrder;
        }
        else {
            this.modules = arrModule;
        }
    }

    getModuleDisplayName() {
        let modulesName = {};
        for (let key in this.globalVars.configData.common.modules) {
            modulesName[key] = this.helper.getDisplayModuleName(key);
        }
        this.modulesDisplayName = modulesName;
        this.globalVars.root.modulesDisplayName = modulesName;
    }

    SetFooterText() {
        let currentYear = new Date().getFullYear().toString();
        if (this.globalVars.isArabic)
            currentYear = this.helper.convertToArabic(currentYear);
        let suppliedByText = this.helper.getPhrase("SuppliedBy", "Common");
        let hrefAttr = "http://www.euroland.com/?selectlanguage=" + this.helper.getLanguageName();
        //this.appFooter = this.domSanitizer.bypassSecurityTrustHtml(suppliedByText.replace('Euroland.com', '<a href="javascript:irApp.root.helper.openExternalLink(\'' + hrefAttr + '\');" class="ui-link">Euroland.com</a>')
        //    .replace("{0}", currentYear));
        this.appFooter = this.domSanitizer.bypassSecurityTrustHtml(suppliedByText.replace('Euroland.com', '<a id="btn_linktosetting" class="ui-link">Euroland.com</a>')
            .replace("{0}", currentYear));

        setTimeout(() => {
            this.renderer.listen(document.getElementById("btn_linktosetting"), 'click', (event) => {
                this.helper.openExternalLink(hrefAttr);
            })
        }, 1000);
    }

    /*---Button Events----*/
    showSharePopup(event) {
        if (this.globalVars.isIOS)
            this.helper.showSharePopup(this, event);
        else {
            let companyName = this.helper.getConfigData("common", "companyname", true);
            let title = this.helper.getPhrase("ShareVia").replace("[name]", companyName);
            this.helper.showSharePopup(this, event, title);
        }
    }

    sendViaEmail() {
        let subjectEmail = this.helper.getConfigData("common", "companyname", true);
        let hrefAttr = "http://www.euroland.com/?selectlanguage=" + this.helper.getLanguageName();
        let appUrl = this.globalVars.isIOS ? this.helper.getConfigData("shareviaemail", "itunesappurl") : this.helper.getConfigData("shareviaemail", "androidappurl");
        let appName = this.helper.getConfigData("common", "appname", true);
        let bodyEmail = "<bdo dir='auto'>" + appName + "</bdo><br/><br/>" +
            "<a style='display:table-cell;vertical-align:middle;padding-left:5px;' href='" + appUrl + "'>" + appUrl + "</a>" +
            "<div style='color:#979697;padding-top:30px;font-size:14px;'><bdo dir='auto'>" +
            appName + " " + this.helper.getPhrase("Footer", "ShareViaEmail").replace('[euroland.com]', '<a href="' + hrefAttr + '" class="ui-link">Euroland.com</a>') +
            "</bdo></div><br/>";
        //window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
        if (this.globalVars.isIOS) {
            let imgUrl = this.globalVars.serviceBaseUrl + "company" + "/" + this.globalVars.configData.companycode.toLowerCase() + "/appicon.png";
            bodyEmail += "<img src='" + imgUrl + "' width='60px' height='60px' border=0></img>";
            window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
        }
        else
            SocialSharing.shareViaEmail(bodyEmail, subjectEmail, [""], [""], [""], [""]);
        /*if (app.deviceInfo.Name == Platform.Android) {
            if (cordova.plugins.email != undefined) {
                cordova.plugins.email.open({
                    to: '',
                    subject: subjectEmail,
                    body: bodyEmail,
                    attachments: androidIconUrl,
                    isHtml: true
                });
            }
            else {
                window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
            }
        }
        else {
            let imgUrl = settings.common.serviceBaseUrl + "company" + "/" + defaultCompanyCode.toLowerCase() + "/appicon.png";
            bodyEmail += "<img src='" + imgUrl + "' width='60px' height='60px' border=0></img>";
            window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
        }*/
    }

    tweetThis() {
        let textContent = this.helper.getConfigData("common", "appname", true);
        let urlApp = "";
        if (this.globalVars.isIOS)
            urlApp = this.helper.getConfigData("shareviaemail", "itunesappurl");
        else
            urlApp = this.helper.getConfigData("shareviaemail", "androidappurl");
        SocialSharing.shareViaTwitter(textContent, null, urlApp);
    }
    /*---End Button Events----*/

    /*---TICKER----*/
    getTickerData() {
        this.tickerService.getTickerData().then(data => {
            if (data != null && data instanceof Array && data.length > 0) {
                this.isShowTickerMess = false;
                let tickerData = this.processTickerData(data);
                this.tickers = tickerData;
                if (this.globalVars.isTablet) {
                    if (!this.activeTickerIndex) {
                        this.activeTickerIndex = 0;
                        this.activeTicker = this.tickers[0];
                    }
                    this.genChart();
                }
            }
            else {
                this.isShowTickerMess = true;
            }
            this.tickerLoaded = true;
            Splashscreen.hide();
        });
        if (this.refresher != null) {
            this.refresher.complete();
            this.refresher = null;
        }
    }

    processTickerData(data) {
        let tickers = [];
        if (this.globalVars.configData.common.instruments && this.globalVars.configData.common.instruments.length > 0) {
            this.globalVars.configData.common.instruments.forEach((obj) => {
                let tickerData = data.filter(ticker => ticker.InstrumentId == obj.instrumentid);
                if (tickerData.length > 0) {
                    let ticker = tickerData[0];
                    ticker.Name = this.helper.getConfigValueByLang(obj.name);
                    let currency = "";
                    if (this.globalVars.generalSettings.currency.isDefault) {
                        currency = obj.currencycode;
                    }
                    else {
                        currency = this.globalVars.generalSettings.currency.value;
                    }
                    //Get Decimal Digit
                    ticker.decimalDigits = this.helper.getDecimalDigits(currency);
                    //Get currency name
                    ticker.Currency = this.helper.getCurrencyName(currency);
                    //Get ticker date
                    let dDate = ticker.Date.split("T")[0].split("-");
                    let dTime = ticker.Date.split("T")[1].split(":");
                    let tDate = this.helper.dateFormat(new Date(dDate[0], dDate[1] - 1, dDate[2], dTime[0], dTime[1]), this.globalVars.generalSettings.shortDateFormat + " " + this.globalVars.generalSettings.timeFormat);//new Date(dDate[0], dDate[1] - 1, dDate[2], dTime[0], dTime[1]).format(shortDatePattern + " " + timePattern);
                    //let today = new Date();
                    //Get base Utc Offset
                    let market = this.globalVars.configData.common.markets.filter(market => market.id == obj.marketid);
                    if (market.length > 0) {
                        let utcOffset = "(" + market[0].baseutcoffset + ")";
                        if (this.globalVars.isArabic)
                            utcOffset = this.helper.convertToArabic(utcOffset);
                        tDate = tDate + " " + utcOffset;
                    }

                    ticker.date = this.domSanitizer.bypassSecurityTrustHtml(tDate);
                    //Check market is open or close
                    if (this.helper.getMarketStatus(obj.marketid))
                        ticker.marketStatus = "open";
                    else
                        ticker.marketStatus = "close";

                    let tLast = parseFloat(ticker.Last);
                    let tPrevClose = parseFloat(ticker.PrevClose);
                    ticker.Change = (tPrevClose == 0 ? 0 : tLast - tPrevClose);
                    ticker.changePercent = (tPrevClose == 0 ? 0 : ((ticker.Change / tPrevClose) * (100)));

                    tickers.push(ticker);
                }
            });
        }
        return tickers;
    }

    //set interval for tickers
    setTickerInterval() {
        if (!this.tickerInterval || this.tickerInterval == null) {
            this.tickerInterval = setInterval(() => {
                if (this.isOnline) {
                    let marketClose = true;
                    for (let i = 0; i < this.globalVars.configData.common.markets.length; i++) {
                        if (this.helper.getMarketStatus(this.globalVars.configData.common.markets[i].id)) {
                            marketClose = false;
                            break;
                        }
                    }
                    if (!marketClose) {
                        this.getTickerData();
                    }
                }
            }, this.globalVars.tickerTimeInterval);
        }
    }

    //chart for ipad layout
    tickerChange(event) {
        if (this.globalVars.isTablet && this.activeTickerIndex != undefined) {
            let index = event.activeIndex - 1;
            if (index >= this.tickers.length)
                index = 0;
            this.activeTickerIndex = index;
            this.activeTicker = this.tickers[this.activeTickerIndex];
            this.genChart();
        }
    }
    genChart() {
        this.currentDecimalDigits = this.activeTicker["decimalDigits"];
        this.chartService.getChartData(this.activeTicker["InstrumentId"], this.chartPeriod).then(data => {
            if (data["close"] instanceof Array && data["close"].length > 0)
                this.drawChart(data["close"]);
        });
    }

    drawChart(data) {
        if (!this.charts)
            this.charts = {};
        let plotLine = null;
        let prevClose = parseFloat(this.activeTicker["PrevClose"]);
        let objRange = { min: null, max: null };
        if (this.chartPeriod == 1) {
            plotLine = [{
                value: prevClose,
                color: 'red',
                dashStyle: 'ShortDot',
                width: 1,
                label: {
                    text: this.helper.formatNumber(prevClose, this.currentDecimalDigits),
                    x: 1
                }
            }];
            objRange = this.getMinMaxSeries(data, prevClose);
        }

        if (!this.charts[this.activeTicker["InstrumentId"]]) {
            this.charts[this.activeTicker["InstrumentId"]] = new Highcharts.StockChart(this.getChartOptions(data, plotLine, objRange));
        }
        else {
            //prevClose = parseFloat(279.60);
            //console.log(12345);
            //this.charts[this.activeTicker.InstrumentId].series[0].setData(data);
            let currentChart = this.charts[this.activeTicker["InstrumentId"]];
            let series = currentChart.series[0];
            if (series != undefined && series != null) {
                //alert(data.length);
                currentChart.series[0].setData(data);
                currentChart.redraw()
                let currentPlotLine = currentChart.yAxis[0].plotLinesAndBands[0];
                let currentPrevClose = 0;
                if (currentPlotLine && currentPlotLine.options && currentPlotLine.options.value)
                    currentPrevClose = currentPlotLine.options.value;
                if (prevClose != currentPrevClose) {
                    //plotLine = [{
                    //    value: prevClose,
                    //    color: 'red',
                    //    dashStyle: 'ShortDot',
                    //    width: 1,
                    //    label: {
                    //        text: this.helper.formatNumber(prevClose, this.currentDecimalDigits),
                    //        x: 1
                    //    }
                    //}];
                    //objRange = this.getMinMaxSeries(data, prevClose);
                    currentChart.yAxis[0].removePlotLine();
                    currentChart.yAxis[0].addPlotLine(plotLine[0]);
                }
            }
            currentChart.yAxis[0].setExtremes(objRange.min, objRange.max);
        }
    }
    getChartOptions(data, plotLine, objRange) {
        if (!this.chartOptions) {
            let $scope = this;
            this.chartOptions = {
                global: {
                    useUTC: true
                },
                lang: {
                    shortMonths: this.helper.getPhrase("MonthNamesShort", "Common"),
                    weekdays: this.helper.getPhrase("DOWNames", "Common")
                },
                chart: {
                    spacingTop: 15,
                    spacingBottom: 0,
                    spacingLeft: 0,
                    spacingRight: 0,
                    backgroundColor: null,
                    pinchType: ""
                },
                title: {
                    text: null
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M',
                        second: '%H:%M'
                    },
                    labels: {
                        enabled: true,
                        formatter: function () {
                            let xValue = new Date(this.value);
                            let xUtcValue = "";
                            if ($scope.chartPeriod == 1)
                                xUtcValue = $scope.helper.dateFormat(new Date(xValue.getUTCFullYear(), xValue.getUTCMonth(), xValue.getUTCDate(), xValue.getUTCHours(), xValue.getUTCMinutes()), $scope.globalVars.generalSettings.timeFormat);
                            else
                                xUtcValue = $scope.helper.dateFormat(new Date(xValue.getUTCFullYear(), xValue.getUTCMonth(), xValue.getUTCDate()), $scope.dateFormatWithoutYear);
                            return xUtcValue;
                        }
                    }
                },
                yAxis: {
                    gridLineWidth: 0,
                    lineWidth: 2,
                    tickPosition: "inside",
                    showLastLabel: true,
                    labels: {
                        enable: true,
                        x: -5,
                        formatter: function () {
                            if (this.isFirst || this.isLast)
                                return $scope.helper.formatNumber(this.value, $scope.currentDecimalDigits);
                        }
                    }
                },
                tooltip: {
                    animation: false,
                    crosshairs: false,
                    useHTML: true,
                    formatter: function () {
                        let xValue = new Date(this.x);
                        let tooltipDate = new Date(xValue.getUTCFullYear(), xValue.getUTCMonth(), xValue.getUTCDate(), xValue.getUTCHours(), xValue.getUTCMinutes(), xValue.getUTCSeconds());
                        if ($scope.chartPeriod == 1)
                            tooltipDate = $scope.helper.dateFormat(tooltipDate, $scope.globalVars.generalSettings.longDateFormat + " " + $scope.globalVars.generalSettings.timeFormat);
                        else
                            tooltipDate = $scope.helper.dateFormat(tooltipDate, $scope.globalVars.generalSettings.longDateFormat);
                        let s = '<div style="font-size:9pt;" class="ticker-chart-tooltip-date">' + tooltipDate + '</div>';
                        this.points.reverse().forEach(function (point, i) {
                            let yValue = $scope.helper.formatNumber(point.y, $scope.currentDecimalDigits);
                            s += '<div class="ticker-chart-tooltip">';
                            s += '<span style="color:' + point.series.color + ';">' + point.series.name + '</span>  <span>' + yValue + '</span>';
                            s += '</div>';
                        });
                        return s;
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                navigation: {
                    buttonOptions: {
                        enabled: false
                    }
                },
                navigator: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                rangeSelector: {
                    enabled: false
                }
            };
        }
        let options = Object.assign({}, this.chartOptions);
        options.chart.renderTo = "ticker-chart-" + this.activeTicker["InstrumentId"];
        //if(plotLine != null)
        options.yAxis.plotLines = plotLine;
        //if(objRange.min != null)
        options.yAxis.min = objRange.min;
        //if(objRange.max != null)
        options.yAxis.max = objRange.max;
        options.series = [{
            name: this.helper.getPhrase("Price", "ShareGraph"),
            color: this.priceChartColor,
            //animation: false,
            data: data
        }];
        return options;
    }
    getMinMaxSeries(data, prevClose) {
        let pData = data.slice(0);
        pData.sort(function (a, b) { if (a[1] < b[1]) return -1; if (a[1] > b[1]) return 1; return 0; })
        let minValue = pData[0][1];
        let maxValue = pData[pData.length - 1][1];
        if (prevClose >= minValue) {
            if (prevClose > maxValue) {
                maxValue = prevClose + 0.1;
            }
            else {
                minValue = null;
                maxValue = null;
            }
        }
        else {
            minValue = prevClose - 0.1;
        }
        return { min: minValue, max: maxValue };
    }
    /*---END TICKER----*/
}
