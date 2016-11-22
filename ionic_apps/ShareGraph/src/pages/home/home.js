"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_native_1 = require('ionic-native');
var ticker_service_1 = require('../../providers/ticker-service');
var chart_service_1 = require('../../providers/chart-service');
var HomePage = (function () {
    function HomePage(platform, navCtrl, domSanitizer, globalVars, menu, appConfigService, translationService, helper, tickerService, chartService, authService, profileService) {
        this.navCtrl = navCtrl;
        this.domSanitizer = domSanitizer;
        this.globalVars = globalVars;
        this.menu = menu;
        this.appConfigService = appConfigService;
        this.translationService = translationService;
        this.helper = helper;
        this.tickerService = tickerService;
        this.chartService = chartService;
        this.authService = authService;
        this.profileService = profileService;
        this.isOnline = true;
        this.tickerLoaded = true;
        this.tickers = [];
        this.platform = platform;
    }
    /*Page Life Circle*/
    HomePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.globalVars.currentModule = "home";
        this.setUserText();
        if (this.globalVars.changedLanguage && this.globalVars.changedLanguage == true) {
            this.loadAllPhrasesInPage();
            this.getModuleDisplayName();
            this.globalVars.changedLanguage = false;
            if (!this.globalVars.changedCurrency) {
                this.tickers = [];
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
            var tickerData_1 = this.tickers;
            this.tickers = [];
            setTimeout(function () {
                _this.tickers = tickerData_1;
            }, 100);
            this.globalVars.changedDecimalSeparator = false;
        }
    };
    HomePage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.authService.getUserData().then(function (data) {
            if (data != null) {
                _this.globalVars.user = data;
                _this.profileService.getProfileStatus();
                _this.profileService.getProfileData();
            }
        });
        this.appConfigService.load().then(function (data) {
            _this.globalVars.configData = data;
            //Get companycode
            _this.globalVars.companyCode = data["companycode"];
            _this.appConfigService.getGeneralSettingsData().then(function (data) {
                if (data != null)
                    _this.globalVars.generalSettings = data;
                _this.loadAppSettings();
            });
        });
        this.setTickerInterval();
        this.menu.enable(true, "irapp-leftmenu");
        if (this.globalVars.phrasesData != null)
            this.helper.checkAppStatus();
    };
    HomePage.prototype.ionViewDidLeave = function () {
        if (this.tickerInterval != null) {
            clearInterval(this.tickerInterval);
            this.tickerInterval = null;
        }
        this.menu.enable(false, "irapp-leftmenu");
    };
    /*End Page Life Circle*/
    HomePage.prototype.doRefresh = function (refresher) {
        if (this.refresher == null) {
            this.refresher = refresher;
            this.getTickerData();
        }
    };
    HomePage.prototype.loadAllPhrasesInPage = function () {
        this.tickerPhrases = {
            open: this.helper.getPhrase("Open", "Common"),
            volume: this.helper.getPhrase("Volume", "Common"),
            hight: this.helper.getPhrase("High", "Common"),
            low: this.helper.getPhrase("Low", "Common"),
            note: this.helper.getPhrase("MessDataDelayed", "Common")
        };
        this.globalVars.root.settingsText = this.helper.getPhrase("Settings", "Common");
        this.homePageTitle = this.helper.getConfigData("common", "companyname", true);
        this.messNoData = this.helper.getPhrase("MsgNoData", "Common");
        //Gen Modules
        this.moduleNote = this.domSanitizer.bypassSecurityTrustHtml(this.helper.getPhrase("MenuDesc", "Common")); //.replace("<a>","<a class='link-to-settings' href='javascript:irApp.root.helper.goToSettings()'>"));
        this.SetFooterText();
    };
    /*-----Get App Settings-----*/
    HomePage.prototype.loadAppSettings = function () {
        var _this = this;
        //this.isOnline = false;
        //Check if isDefault => get language from device
        this.platform.ready().then(function () {
            if (_this.globalVars.isNativeMode) {
                _this.isOnline = _this.globalVars.isOnline;
                //this.bindNetworkStateEvent();
                //register Deeplinks
                //this.registerDeeplinks();
                if (_this.globalVars.generalSettings.language.isDefault) {
                    ionic_native_1.Globalization.getPreferredLanguage().then(function (lang) {
                        if (lang != null && lang.value.length > 0) {
                            _this.globalVars.generalSettings.language.value = _this.helper.getLanguageCode(lang.value.toLowerCase());
                            _this.loadPhrasesData(_this.globalVars.generalSettings.language.value);
                        }
                        else {
                            _this.globalVars.generalSettings.language.value = "en-gb";
                            _this.loadPhrasesData(_this.globalVars.generalSettings.language.value);
                        }
                    });
                } // else load language from obj
                else
                    _this.loadPhrasesData(_this.globalVars.generalSettings.language.value);
                //Load ticker
                //Get Number Pattern from device
                if (_this.globalVars.generalSettings.separator.isDefault) {
                    ionic_native_1.Globalization.getNumberPattern({ type: 'decimal' }).then(function (pattern) {
                        var decimalseparator = pattern.decimal;
                        var thousandseparator = pattern.grouping;
                        if (decimalseparator != "," && decimalseparator != ".") {
                            thousandseparator = ",";
                            decimalseparator = ".";
                        }
                        _this.globalVars.generalSettings.separator.decimal = decimalseparator;
                        _this.globalVars.generalSettings.separator.thousand = thousandseparator;
                    });
                }
                //Get short date pattern from device
                ionic_native_1.Globalization.getDatePattern({ formatLength: 'short', selector: 'date' }).then(function (date) {
                    _this.globalVars.generalSettings.shortDateFormat = _this.helper.convertJSDatePattern(date.pattern, true);
                });
                //Get time pattern from device
                ionic_native_1.Globalization.getDatePattern({ formatLength: 'short', selector: 'time' }).then(function (time) {
                    _this.globalVars.generalSettings.timeFormat = _this.helper.convertJSDatePattern(time.pattern, false);
                    //this.getTickerData();
                });
                //Get long date pattern from device
                ionic_native_1.Globalization.getDatePattern({ formatLength: 'long', selector: 'date' }).then(function (date) {
                    _this.globalVars.generalSettings.longDateFormat = _this.helper.convertJSDatePattern(date.pattern, true);
                    //this.genHomePageContent();
                    //this.getTickerData();
                });
            }
            else {
                _this.loadPhrasesData(_this.globalVars.generalSettings.language.value);
            }
        });
    };
    HomePage.prototype.registerDeeplinks = function () {
        //Deeplinks.routeWithNavController(this.nav, {
        //    '/account/resetpassword/:code': ChangePasswordPage
        //}).subscribe((match) => {
        //    //console.log(match);
        //    if (match.$link.url.toLowerCase().indexOf("myir://account/resetpassword/") >= 0 && match.$link.queryString.length > 0) {
        //        let queryString = match.$link.queryString.split("&");
        //        let email = decodeURIComponent(queryString[0].split("=")[1]);
        //        let code = decodeURIComponent(queryString[1].split("=")[1]);
        //        this.nav.push(ChangePasswordPage, { resetPassData: { email: email, resetCode: code } });
        //    }
        //}, (nomatch) => {
        //});
    };
    HomePage.prototype.loadPhrasesData = function (lang) {
        var _this = this;
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
        this.translationService.load(lang).then(function (data) {
            _this.globalVars.phrasesData = data;
            if (!_this.isOnline)
                _this.helper.createOffileMess();
            _this.helper.checkTokenExpired();
            _this.helper.setConfig("backButtonText", _this.helper.getPhrase("Back"), "ios");
            _this.loadAllPhrasesInPage();
            //Get period for chart in home for tablet layout
            if (_this.globalVars.isTablet) {
                if (_this.globalVars.configData.home && _this.globalVars.configData.home.graphperiod)
                    _this.chartPeriod = _this.helper.getDefaultChartPeriod(_this.globalVars.configData.home.graphperiod.toLowerCase());
                else
                    _this.chartPeriod = 1;
                _this.priceChartColor = !_this.globalVars.configData.sharegraph.pricechartcolor ? '#7EBFEA' : _this.globalVars.configData.sharegraph.pricechartcolor;
                _this.dateFormatWithoutYear = _this.helper.getDateFormatWithoutYear();
            }
            _this.getTickerData();
            _this.genHomePageContent();
            _this.helper.updateDateTimeConfig();
            _this.setTickerInterval();
        });
    };
    HomePage.prototype.getNumberSeparatorFromDevice = function () {
        var _this = this;
        if (this.globalVars.generalSettings.separator.isDefault) {
            ionic_native_1.Globalization.getNumberPattern({ type: 'decimal' }).then(function (pattern) {
                var decimalseparator = pattern.decimal;
                var thousandseparator = pattern.grouping;
                if (decimalseparator != "," && decimalseparator != ".") {
                    thousandseparator = ",";
                    decimalseparator = ".";
                }
                _this.globalVars.generalSettings.separator.decimal = decimalseparator;
                _this.globalVars.generalSettings.separator.thousand = thousandseparator;
                _this.getShortDatePatternFromDevice();
            });
        }
        else {
            this.getShortDatePatternFromDevice();
        }
    };
    HomePage.prototype.getShortDatePatternFromDevice = function () {
        var _this = this;
        ionic_native_1.Globalization.getDatePattern({ formatLength: 'short', selector: 'date' }).then(function (date) {
            _this.globalVars.generalSettings.shortDateFormat = _this.helper.convertJSDatePattern(date.pattern, true);
            _this.getTimePatternFromDevice();
        });
    };
    HomePage.prototype.getTimePatternFromDevice = function () {
        var _this = this;
        ionic_native_1.Globalization.getDatePattern({ formatLength: 'short', selector: 'time' }).then(function (time) {
            _this.globalVars.generalSettings.timeFormat = _this.helper.convertJSDatePattern(time.pattern, false);
            _this.getLongDatePatternFromDevice();
        });
    };
    HomePage.prototype.getLongDatePatternFromDevice = function () {
        var _this = this;
        ionic_native_1.Globalization.getDatePattern({ formatLength: 'long', selector: 'date' }).then(function (date) {
            _this.globalVars.generalSettings.longDateFormat = _this.helper.convertJSDatePattern(date.pattern, true);
            _this.getTickerData();
        });
    };
    /*-----End Get App Settings-----*/
    HomePage.prototype.genHomePageContent = function () {
        this.setUserText();
        this.loadAllPhrasesInPage();
        this.getModuleDisplayName();
        this.getTickerData();
        this.appConfigService.setGeneralSettingsData();
        //this.appConfigServices.setUserConfigData();
        //this.localStorage.set(this.appSettingsStorageKey, JSON.stringify(irApp.appSettingsData));
        this.instruments = this.globalVars.configData.common.instruments;
        this.getModuleDisplayName();
        this.getModules();
        //register Deeplinks
        this.registerDeeplinks();
    };
    HomePage.prototype.setUserText = function () {
        if (this.authService.hasLoggedIn()) {
            this.globalVars.root.userText = this.authService.getUserName();
        }
        else {
            this.globalVars.root.userText = this.helper.getPhrase("Login");
        }
    };
    HomePage.prototype.getModules = function () {
        var _this = this;
        //Get default module in config
        var arrModule = [];
        var arrAllModule = [];
        if (this.globalVars.configData.common.modules) {
            if (!this.globalVars.isTablet) {
                for (var key in this.globalVars.configData.common.modules) {
                    var displayName = this.helper.getDisplayModuleName(key);
                    var moduleComponent = this.helper.getPage(key);
                    arrAllModule.push({ moduleName: key, displayName: displayName, component: moduleComponent });
                    if (this.globalVars.configData.common.modules[key].phone == true) {
                        arrModule.push({ moduleName: key, displayName: displayName, orientation: "portrait", component: moduleComponent });
                    }
                }
            }
            else {
                for (var key in this.globalVars.configData.common.modules) {
                    var displayName = this.helper.getDisplayModuleName(key);
                    var moduleComponent = this.helper.getPage(key);
                    arrAllModule.push({ moduleName: key, displayName: displayName, component: moduleComponent });
                    var orientation_1 = "";
                    if (this.globalVars.configData.common.modules[key].portrait == true && this.globalVars.configData.common.modules[key].landscape == true) {
                        orientation_1 = "all";
                    }
                    else {
                        if (this.globalVars.configData.common.modules[key].portrait === true)
                            orientation_1 = "portrait";
                        else if (this.globalVars.configData.common.modules[key].landscape === true)
                            orientation_1 = "landscape";
                    }
                    if (orientation_1.length > 0)
                        arrModule.push({ moduleName: key, displayName: displayName, orientation: orientation_1, component: moduleComponent });
                }
            }
            this.globalVars.root.leftMenuModules = arrAllModule;
            this.globalVars.generalSettings.quickMenu.defaultOrder = arrModule;
        }
        if (!this.globalVars.generalSettings.quickMenu.isDefault && this.globalVars.generalSettings.quickMenu.customOrder.length > 0) {
            this.globalVars.generalSettings.quickMenu.customOrder.forEach(function (obj) {
                obj.displayName = _this.helper.getDisplayModuleName(obj.moduleName);
                obj.component = _this.helper.getPage(obj.moduleName);
            });
            this.modules = this.globalVars.generalSettings.quickMenu.customOrder;
        }
        else {
            this.modules = arrModule;
        }
    };
    HomePage.prototype.getModuleDisplayName = function () {
        var modulesName = {};
        for (var key in this.globalVars.configData.common.modules) {
            modulesName[key] = this.helper.getDisplayModuleName(key);
        }
        this.modulesDisplayName = modulesName;
        this.globalVars.root.modulesDisplayName = modulesName;
    };
    HomePage.prototype.SetFooterText = function () {
        var currentYear = new Date().getFullYear().toString();
        if (this.globalVars.isArabic)
            currentYear = this.helper.convertToArabic(currentYear);
        var suppliedByText = this.helper.getPhrase("SuppliedBy", "Common");
        var hrefAttr = "http://www.euroland.com/?selectlanguage=" + this.helper.getLanguageName();
        this.appFooter = this.domSanitizer.bypassSecurityTrustHtml(suppliedByText.replace('Euroland.com', '<a href="javascript:irApp.root.helper.openExternalLink(\'' + hrefAttr + '\');" class="ui-link">Euroland.com</a>')
            .replace("{0}", currentYear));
    };
    /*---Button Events----*/
    HomePage.prototype.showSharePopup = function (event) {
        this.helper.showSharePopup(this, event);
    };
    HomePage.prototype.sendViaEmail = function () {
        var subjectEmail = this.helper.getConfigData("common", "companyname", true);
        var hrefAttr = "http://www.euroland.com/?selectlanguage=" + this.helper.getLanguageName();
        var appUrl = this.globalVars.isIOS ? this.helper.getConfigData("shareviaemail", "itunesappurl") : this.helper.getConfigData("shareviaemail", "androidappurl");
        var appName = this.helper.getConfigData("common", "appname", true);
        var bodyEmail = "<bdo dir='auto'>" + appName + "</bdo><br/><br/>" +
            "<a style='display:table-cell;vertical-align:middle;padding-left:5px;' href='" + appUrl + "'>" + appUrl + "</a>" +
            "<div style='color:#979697;padding-top:30px;font-size:14px;'><bdo dir='auto'>" +
            appName + " " + this.helper.getPhrase("Footer", "ShareViaEmail").replace('[euroland.com]', '<a href="' + hrefAttr + '" class="ui-link">Euroland.com</a>') +
            "</bdo></div><br/>";
        //window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
        if (this.globalVars.isIOS) {
            var imgUrl = this.globalVars.serviceBaseUrl + "company" + "/" + this.globalVars.configData.companycode.toLowerCase() + "/appicon.png";
            bodyEmail += "<img src='" + imgUrl + "' width='60px' height='60px' border=0></img>";
            window.location.href = "mailto:?subject=" + subjectEmail + "&body=" + encodeURIComponent(bodyEmail);
        }
        else
            ionic_native_1.SocialSharing.shareViaEmail(bodyEmail, subjectEmail, [""], [""], [""], [""]);
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
    };
    HomePage.prototype.tweetThis = function () {
        var textContent = this.helper.getConfigData("common", "appname", true);
        var urlApp = "";
        if (this.globalVars.isIOS)
            urlApp = this.helper.getConfigData("shareviaemail", "itunesappurl");
        else
            urlApp = this.helper.getConfigData("shareviaemail", "androidappurl");
        ionic_native_1.SocialSharing.shareViaTwitter(textContent, null, urlApp);
    };
    /*---End Button Events----*/
    /*---TICKER----*/
    HomePage.prototype.getTickerData = function () {
        var _this = this;
        this.tickerService.getTickerData().then(function (data) {
            //if (data != null && data.length > 0) {
            if (data != null) {
                var tickerData = _this.processTickerData(data);
                //if(!this.tickers)
                _this.tickers = tickerData;
                //else{
                //    this.tickers = [];
                //    setTimeout(()=>{
                //        this.tickers = tickerData;
                //    },300);
                //}
                if (_this.globalVars.isTablet) {
                    if (!_this.activeTickerIndex) {
                        _this.activeTickerIndex = 0;
                        _this.activeTicker = _this.tickers[0];
                    }
                    _this.genChart();
                }
            }
            _this.tickerLoaded = true;
            //if (navigator.splashscreen) {
            //    navigator.splashscreen.hide();
            //}
        });
        if (this.refresher != null) {
            this.refresher.complete();
            this.refresher = null;
        }
    };
    HomePage.prototype.processTickerData = function (data) {
        var _this = this;
        var tickers = [];
        if (this.globalVars.configData.common.instruments && this.globalVars.configData.common.instruments.length > 0) {
            this.globalVars.configData.common.instruments.forEach(function (obj) {
                var tickerData = data.filter(function (ticker) { return ticker.InstrumentId == obj.instrumentid; });
                if (tickerData.length > 0) {
                    var ticker = tickerData[0];
                    ticker.Name = _this.helper.getConfigValueByLang(obj.name);
                    var currency = "";
                    if (_this.globalVars.generalSettings.currency.isDefault) {
                        currency = obj.currencycode;
                    }
                    else {
                        currency = _this.globalVars.generalSettings.currency.value;
                    }
                    //Get Decimal Digit
                    ticker.decimalDigits = _this.helper.getDecimalDigits(currency);
                    //Get currency name
                    ticker.Currency = _this.helper.getCurrencyName(currency);
                    //Get ticker date
                    var dDate = ticker.Date.split("T")[0].split("-");
                    var dTime = ticker.Date.split("T")[1].split(":");
                    var tDate = _this.helper.dateFormat(new Date(dDate[0], dDate[1] - 1, dDate[2], dTime[0], dTime[1]), _this.globalVars.generalSettings.shortDateFormat + " " + _this.globalVars.generalSettings.timeFormat); //new Date(dDate[0], dDate[1] - 1, dDate[2], dTime[0], dTime[1]).format(shortDatePattern + " " + timePattern);
                    //let today = new Date();
                    var utcOffSet = "";
                    //Get base Utc Offset
                    var market = _this.globalVars.configData.common.markets.filter(function (market) { return market.id == obj.marketid; });
                    if (market.length > 0) {
                        var utcOffset = "(" + market[0].baseutcoffset + ")";
                        if (_this.globalVars.isArabic)
                            utcOffset = _this.helper.convertToArabic(utcOffset);
                        tDate = tDate + " " + utcOffset;
                    }
                    ticker.date = _this.domSanitizer.bypassSecurityTrustHtml(tDate);
                    //Check market is open or close
                    if (_this.helper.getMarketStatus(obj.marketid))
                        ticker.marketStatus = "open";
                    else
                        ticker.marketStatus = "close";
                    var tLast = parseFloat(ticker.Last);
                    var tPrevClose = parseFloat(ticker.PrevClose);
                    ticker.Change = (tPrevClose == 0 ? 0 : tLast - tPrevClose);
                    ticker.changePercent = (tPrevClose == 0 ? 0 : ((ticker.Change / tPrevClose) * (100)));
                    tickers.push(ticker);
                }
            });
        }
        return tickers;
    };
    //set interval for tickers
    HomePage.prototype.setTickerInterval = function () {
        var _this = this;
        if (!this.tickerInterval || this.tickerInterval == null) {
            this.tickerInterval = setInterval(function () {
                if (_this.isOnline) {
                    var marketClose = true;
                    for (var i = 0; i < _this.globalVars.configData.common.markets.length; i++) {
                        if (_this.helper.getMarketStatus(_this.globalVars.configData.common.markets[i].id)) {
                            marketClose = false;
                            break;
                        }
                    }
                    if (!marketClose) {
                        _this.getTickerData();
                    }
                }
            }, this.globalVars.tickerTimeInterval);
        }
    };
    //chart for ipad layout
    HomePage.prototype.tickerChange = function (event) {
        if (this.globalVars.isTablet) {
            this.activeTickerIndex = event.activeIndex;
            this.activeTicker = this.tickers[this.activeTickerIndex];
            this.genChart();
        }
    };
    HomePage.prototype.genChart = function () {
        this.currentDecimalDigits = this.activeTicker["decimalDigits"];
        //this.chartService.getChartData(this.activeTicker.InstrumentId, this.chartPeriod).then(data => {
        //    if (data.close.length > 0)
        //        this.drawChart(data.close);
        //});
    };
    HomePage.prototype.drawChart = function (data) {
        if (!this.charts)
            this.charts = {};
        var plotLine = null;
        var prevClose = parseFloat(this.activeTicker["PrevClose"]);
        var objRange = { min: null, max: null };
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
        }
        else {
            //prevClose = parseFloat(279.60);
            //console.log(12345);
            //this.charts[this.activeTicker.InstrumentId].series[0].setData(data);
            var currentChart = this.charts[this.activeTicker["InstrumentId"]];
            var series = currentChart.series[0];
            if (series != undefined && series != null) {
                //alert(data.length);
                currentChart.series[0].setData(data);
                currentChart.redraw();
                var currentPlotLine = currentChart.yAxis[0].plotLinesAndBands[0];
                var currentPrevClose = 0;
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
    };
    HomePage.prototype.getChartOptions = function (data, plotLine, objRange) {
        if (!this.chartOptions) {
            var $scope_1 = this;
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
                            var xValue = new Date(this.value);
                            var xUtcValue = "";
                            if ($scope_1.chartPeriod == 1)
                                xUtcValue = $scope_1.helper.dateFormat(new Date(xValue.getUTCFullYear(), xValue.getUTCMonth(), xValue.getUTCDate(), xValue.getUTCHours(), xValue.getUTCMinutes()), $scope_1.globalVars.generalSettings.timeFormat);
                            else
                                xUtcValue = $scope_1.helper.dateFormat(new Date(xValue.getUTCFullYear(), xValue.getUTCMonth(), xValue.getUTCDate()), $scope_1.dateFormatWithoutYear);
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
                                return $scope_1.helper.formatNumber(this.value, $scope_1.currentDecimalDigits);
                        }
                    }
                },
                tooltip: {
                    animation: false,
                    crosshairs: false,
                    useHTML: true,
                    formatter: function () {
                        var xValue = new Date(this.x);
                        var tooltipDate = new Date(xValue.getUTCFullYear(), xValue.getUTCMonth(), xValue.getUTCDate(), xValue.getUTCHours(), xValue.getUTCMinutes(), xValue.getUTCSeconds());
                        if ($scope_1.chartPeriod == 1)
                            tooltipDate = $scope_1.helper.dateFormat(tooltipDate, $scope_1.globalVars.generalSettings.longDateFormat + " " + $scope_1.globalVars.generalSettings.timeFormat);
                        else
                            tooltipDate = $scope_1.helper.dateFormat(tooltipDate, $scope_1.globalVars.generalSettings.longDateFormat);
                        var s = '<div style="font-size:9pt;" class="ticker-chart-tooltip-date">' + tooltipDate + '</div>';
                        this.points.reverse().forEach(function (point, i) {
                            var yValue = $scope_1.helper.formatNumber(point.y, $scope_1.currentDecimalDigits);
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
        var options = Object.assign({}, this.chartOptions);
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
    };
    HomePage.prototype.getMinMaxSeries = function (data, prevClose) {
        var pData = data.slice(0);
        pData.sort(function (a, b) { if (a[1] < b[1])
            return -1; if (a[1] > b[1])
            return 1; return 0; });
        var minValue = pData[0][1];
        var maxValue = pData[pData.length - 1][1];
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
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'page-home',
            templateUrl: 'home.html',
            providers: [ticker_service_1.TickerService, chart_service_1.ChartService]
        })
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
