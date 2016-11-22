"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var chart_service_1 = require('../../providers/chart-service');
var ticker_service_1 = require('../../providers/ticker-service');
var performance_service_1 = require('../../providers/performance-service');
//import { CompareTab } from './comparetab/comparetab';
var scrolltab_1 = require('../../components/scrolltab/scrolltab');
var Highcharts_1 = require('@types/Highcharts');
var ShareGraphPage = (function () {
    function ShareGraphPage(nav, modalController, viewController, helper, globalVars, chartService, tickerService, performanceService, sanitizationService, profileService) {
        this.nav = nav;
        this.modalController = modalController;
        this.viewController = viewController;
        this.helper = helper;
        this.globalVars = globalVars;
        this.chartService = chartService;
        this.tickerService = tickerService;
        this.performanceService = performanceService;
        this.sanitizationService = sanitizationService;
        this.profileService = profileService;
        this.currentPeriod = 0;
        this.decimalDigits = 2;
        this.loading = null;
        this.volumeChartColor = "#4572A7";
        this.priceChartColor = "#7EBFEA";
        this.tickerData = {
            Last: 0,
            High: 0,
            Low: 0,
            Change: 0,
            ChangePercent: 0,
            Volume: 0
        };
        this.tickerTLast = 1;
        this.refresher = null;
        this.isOnline = true;
        this.enableWatchList = false;
        this.enableIndices = false;
        this.unitNumberOfShare = 1;
        this.unitMarketCap = 1;
        this.isTablet = this.globalVars.isTablet;
        if (this.globalVars.configData.sharegraph) {
            if (this.globalVars.configData.sharegraph.defaultperiod)
                this.currentPeriod = this.helper.getDefaultChartPeriod(this.globalVars.configData.sharegraph.defaultperiod); //this.getDefaultPeriodFromConfig();
            if (this.globalVars.configData.sharegraph.pricechartcolor)
                this.priceChartColor = this.globalVars.configData.sharegraph.pricechartcolor;
            if (this.globalVars.configData.sharegraph.volumeChartColor)
                this.volumeChartColor = this.globalVars.configData.sharegraph.volumechartcolor;
        }
        //get all phrases
        this.getPhrasesInPage();
        this.createDefaultPerformanceData();
    }
    ShareGraphPage.prototype.ionViewDidLoad = function () {
        this.scrollTab.genTabData(this, this.globalVars.configData.common.instruments);
    };
    ShareGraphPage.prototype.ionViewWillEnter = function () {
        this.isOnline = this.globalVars.isOnline;
        if (this.globalVars.changedLanguage && this.globalVars.changedLanguage == true) {
            this.viewController.setBackButtonText(this.helper.getPhrase("Back"));
            this.getPhrasesInPage();
        }
        this.enableWatchList = this.profileService.isEnabledWatchlist();
        this.enableIndices = this.profileService.isEnabledIndices();
    };
    ShareGraphPage.prototype.ionViewDidEnter = function () {
        this.helper.checkTokenExpired();
        this.globalVars.currentModule = "sharegraph";
        /*Get default instrumentid when first load*/
        if (!this.currenInstrument) {
            this.currenInstrument = this.globalVars.configData.common.sharetypes[0];
            this.currenInstrument.id = this.currenInstrument.instrumentid;
        }
        if (!this.globalVars["isCloseCompareModal"]) {
            this.selectedTab(this.currenInstrument, true);
            this.setChartInterval();
        }
        else {
            this.globalVars["isCloseCompareModal"] = false;
        }
        this.globalVars.activePage = this;
        this.helper.checkAppStatus();
    };
    ShareGraphPage.prototype.ionViewDidLeave = function () {
        if (this.chartInterval)
            clearInterval(this.chartInterval);
    };
    ShareGraphPage.prototype.doRefresh = function (refresher) {
        if (this.refresher == null) {
            this.refresher = refresher;
            this.selectedTab(this.currenInstrument);
        }
    };
    //get chart data
    ShareGraphPage.prototype.getChartData = function () {
        var _this = this;
        this.chartService.getChartData(this.scrollTab.currentId, this.currentPeriod).then(function (data) {
            _this.genChartData(data);
        });
    };
    ShareGraphPage.prototype.genChartData = function (data) {
        this.closeData = data.close;
        this.volumeData = data.volume;
        if (!this.chart)
            this.generateChart();
        else {
            this.chart.series[0].setData(this.volumeData);
            this.chart.series[1].setData(this.closeData);
        }
    };
    //get all phrase in page
    ShareGraphPage.prototype.getPhrasesInPage = function () {
        this.headerTitle = this.helper.getPhrase("ShareGraph", "Common");
        this.compare = this.helper.getPhrase("Compare", "ShareGraph");
        this.watchlist = this.helper.getPhrase("Watchlist", "ShareGraph");
        this.indices = this.helper.getPhrase("Indices", "ShareGraph");
        var currencyLabel = this.helper.getPhrase("Currency", "ShareGraph");
        //get periods
        this.periods = [
            { name: this.helper.getPhrase("Button1Day", "ShareGraph"), value: "1" },
            { name: this.helper.getPhrase("Button3Month", "ShareGraph"), value: "3" },
            { name: this.helper.getPhrase("Button6Month", "ShareGraph"), value: "6" },
            { name: this.helper.getPhrase("Button1Year", "ShareGraph"), value: "12" },
            { name: this.helper.getPhrase("Button3Year", "ShareGraph"), value: "36" }
        ];
        if (!this.globalVars.generalSettings.currency.isDefault)
            currencyLabel = currencyLabel + " <span class='currency-custom'>(" + this.helper.getPhrase("CustomCurrencyLabel", "ShareGraph") + ")</span>";
        //get number of shares label
        var nosLabel = "";
        this.unitNumberOfShare = 1;
        switch (this.globalVars.configData.sharegraph.noofshares) {
            case "billions":
                nosLabel = this.helper.getPhrase("NoOfSharesBil", "ShareGraph");
                this.unitNumberOfShare = 1000000000;
                break;
            case "millions":
                nosLabel = this.helper.getPhrase("NoOfSharesMil", "ShareGraph");
                this.unitNumberOfShare = 1000000;
                break;
            case "thousands":
                nosLabel = this.helper.getPhrase("NoOfSharesThs", "ShareGraph");
                this.unitNumberOfShare = 1000;
                break;
            default: nosLabel = this.helper.getPhrase("NoOfShares", "ShareGraph");
        }
        //get marketcap label
        var marketCapLabel = "";
        this.unitMarketCap = 1;
        switch (this.globalVars.configData.sharegraph.marketcap) {
            case "billions":
                marketCapLabel = this.helper.getPhrase("MarketCapBil", "ShareGraph");
                this.unitMarketCap = 1000000000;
                break;
            case "millions":
                marketCapLabel = this.helper.getPhrase("MarketCapMil", "ShareGraph");
                this.unitMarketCap = 1000000;
                break;
            case "thousands":
                marketCapLabel = this.helper.getPhrase("MarketCapThs", "ShareGraph");
                this.unitMarketCap = 1000;
                break;
            default: marketCapLabel = this.helper.getPhrase("MarketCap", "ShareGraph");
        }
        this.performancePhrases = {
            sharedata: this.helper.getPhrase("ShareData", "ShareGraph"),
            //sharedataNote: this.helper.getPhrase("ShareDataNote", "ShareGraph"),
            sharedataNote: this.sanitizationService.bypassSecurityTrustHtml(this.helper.getPhrase("ShareDataNote", "ShareGraph").replace("<a>", "<a class='link-to-settings' href='javascript:irApp.root.helper.goToSettings()'>")),
            currency: this.sanitizationService.bypassSecurityTrustHtml(currencyLabel),
            prevClose: this.helper.getPhrase("PreviousClose", "ShareGraph"),
            high: this.helper.getPhrase("WeeksHigh52", "ShareGraph"),
            low: this.helper.getPhrase("WeeksLow52", "ShareGraph"),
            weeks: this.helper.getPhrase("WeeksPercent52", "ShareGraph"),
            ytd: this.helper.getPhrase("YTDPercent", "ShareGraph"),
            marketdata: this.helper.getPhrase("MarketData", "ShareGraph"),
            //marketdataNote: this.helper.getPhrase("MarketDataNote", "ShareGraph"),
            marketdataNote: this.sanitizationService.bypassSecurityTrustHtml(this.helper.getPhrase("MarketDataNote", "ShareGraph").replace("<a>", "<a class='link-to-settings' href='javascript:irApp.root.helper.goToSettings()'>")),
            market: this.helper.getPhrase("Market", "ShareGraph"),
            symbol: this.helper.getPhrase("Symbol", "ShareGraph"),
            list: this.helper.getPhrase("List", "ShareGraph"),
            industry: this.helper.getPhrase("Industry", "ShareGraph"),
            noshare: nosLabel,
            marketcap: marketCapLabel
        };
        this.tickerPhases = {
            last: this.helper.getPhrase("Last", "ShareGraph"),
            change: this.helper.getPhrase("Change", "ShareGraph"),
            changePercent: this.helper.getPhrase("ChangePercent", "ShareGraph")
        };
        if (this.isTablet) {
            this.tickerPhases["high"] = this.helper.getPhrase("High", "ShareGraph");
            this.tickerPhases["low"] = this.helper.getPhrase("Low", "ShareGraph");
            this.tickerPhases["volume"] = this.helper.getPhrase("Volume", "ShareGraph");
        }
    };
    /*-----button events-----*/
    ShareGraphPage.prototype.selectedTab = function (tabData, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        this.helper.checkTokenExpired();
        if (forceReload || (this.refresher != null || tabData.id != this.scrollTab.currentId)) {
            this.helper.showLoading(this);
            this.currenInstrument = tabData;
            this.scrollTab.currentId = tabData.id;
            if (this.currentPeriod > 0) {
                this.selectedPeriod(this.currentPeriod);
            }
            else {
                if (this.globalVars.configData.sharegraph && this.globalVars.configData.sharegraph.defaultperiod)
                    this.selectedPeriod(this.helper.getDefaultChartPeriod(this.globalVars.configData.sharegraph.defaultperiod));
            }
            this.getTickerData();
        }
    };
    ShareGraphPage.prototype.selectedPeriod = function (period, changedInstrument) {
        if (changedInstrument === void 0) { changedInstrument = false; }
        this.helper.checkTokenExpired();
        if (period != this.period || changedInstrument) {
            if (this.chart && this.loading == null) {
                this.chart.showLoading("<div class='custom-spinner'>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "<div class='spinner-blade'></div>" +
                    "</div>");
            }
            this.currentPeriod = period;
            this.getChartData();
        }
    };
    ShareGraphPage.prototype.goCompare = function (compareType) {
        //if (this.helper.userTokenHasExpired()) {
        //    this.helper.showConfirmLogin();
        //}
        //else {
        //    let compareModal = this.modal.create(CompareTab, { params: { type: compareType, activeId: this.currenInstrument.id } });
        //    compareModal.present();
        //}
    };
    /*-----end button events-----*/
    /*---------------CHART----------------*/
    ShareGraphPage.prototype.generateChart = function () {
        var sharegraph = this;
        this.chartOptions = {
            chart: {
                //type: "StockChart",
                animation: false,
                renderTo: "chart-container",
                plotBorderWidth: 0,
                margin: [12, 3, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0,
                backgroundColor: '#EDECF2',
                width: null,
                pinchType: "",
                events: {
                    redraw: function () {
                        if (sharegraph.closeData.length == 0) {
                            this.showLoading(sharegraph.helper.getPhrase("MsgNoData", "Common"));
                        }
                        else {
                            this.hideLoading();
                        }
                    }
                }
            },
            title: {
                text: null
            },
            xAxis: {
                gridLineWidth: 0,
                lineWidth: 0,
                tickWidth: 0,
                labels: {
                    enabled: false
                }
            },
            yAxis: [{
                    title: {
                        text: null
                    },
                    gridLineWidth: 0,
                    showLastLabel: true,
                    tickPosition: "inside",
                    labels: {
                        enabled: true,
                        formatter: function () {
                            return sharegraph.helper.formatNumber(this.value, sharegraph.decimalDigits);
                        }
                    }
                }, {
                    gridLineWidth: 0,
                    title: {
                        text: null
                    },
                    showFirstLabel: false,
                    labels: {
                        enabled: false
                    },
                    opposite: true
                }],
            plotOptions: {
                series: {
                    shadow: false,
                    dataGrouping: {
                        groupPixelWidth: 15
                    }
                },
                column: {
                    borderWidth: 0
                },
                area: {
                    fillOpacity: 0.5,
                    lineColor: '#fff',
                    lineWidth: 2,
                    color: sharegraph.priceChartColor
                }
            },
            tooltip: {
                animation: false,
                //useHTML: (app.deviceInfo.Name == Platform.Android && parseFloat(app.deviceInfo.Version) < 3) ? false : true,
                useHTML: true,
                shared: true,
                crosshairs: true,
                followTouchMove: false,
                style: {
                    padding: 5
                },
                formatter: function () {
                    var tooltipDate = new Date(this.x);
                    if (sharegraph.currentPeriod == 1) {
                        tooltipDate = new Date(tooltipDate.getUTCFullYear(), tooltipDate.getUTCMonth(), tooltipDate.getUTCDate(), tooltipDate.getUTCHours(), tooltipDate.getUTCMinutes(), tooltipDate.getUTCSeconds());
                        tooltipDate = sharegraph.helper.dateFormat(tooltipDate, sharegraph.globalVars.generalSettings.longDateFormat + " " + sharegraph.globalVars.generalSettings.timeFormat);
                    }
                    else {
                        tooltipDate = sharegraph.helper.dateFormat(tooltipDate, sharegraph.globalVars.generalSettings.longDateFormat);
                    }
                    var s = '<span class="sg-tooltip-date">' + tooltipDate + '</span>';
                    this.points.reverse().forEach(function (point) {
                        var value = sharegraph.helper.formatNumber(point.y, point.series.index == 0 ? 0 : sharegraph.decimalDigits);
                        s += '<div class="sg-tooltip-row">';
                        s += '<span class="sg-tooltip-label" style="color:' + point.series.color + ';">' + point.series.name + '</span><span class="sg-tooltip-value">' + value + '</span>';
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
            series: [{
                    name: sharegraph.helper.getPhrase("Volume", "ShareGraph"),
                    color: sharegraph.volumeChartColor,
                    animation: false,
                    type: 'column',
                    inverted: true,
                    yAxis: 1,
                    data: sharegraph.volumeData //(sgobj.chartOptions == null ? arrayVolumeFiltered : [])
                }, {
                    name: sharegraph.helper.getPhrase("Price", "ShareGraph"),
                    type: 'area',
                    animation: false,
                    threshold: null,
                    marker: {
                        enabled: false
                    },
                    data: sharegraph.closeData //(sgobj.chartOptions == null ? arrayCloseFiltered : [])
                }],
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
        Highcharts_1.Highcharts.setOptions({
            lang: {
                shortMonths: sharegraph.helper.getPhrase("MonthNamesShort", "Common"),
                weekdays: sharegraph.helper.getPhrase("DOWNames", "Common")
            }
        });
        this.chart = new Highcharts_1.Highcharts.stockChart(this.chartOptions);
    };
    ShareGraphPage.prototype.setChartInterval = function () {
        var _this = this;
        if (this.chartInterval)
            clearInterval(this.chartInterval);
        this.chartInterval = setInterval(function () {
            var instrument = _this.globalVars.configData.common.instruments.filter(function (s) { return s.instrumentid == _this.scrollTab.currentId; });
            if (instrument.length > 0) {
                var marketId = instrument[0].marketid;
                if (!_this.helper.getMarketStatus(marketId))
                    return;
            }
            _this.getTickerData();
            if (_this.currentPeriod == 1) {
                _this.getChartData();
            }
        }, this.globalVars.sharegraph.timeInterval);
    };
    /*--------------END CHART------------*/
    /*--------------TICKER-----------------------*/
    ShareGraphPage.prototype.getTickerData = function () {
        var _this = this;
        this.tickerService.getTickerData().then(function (tData) {
            if (tData != null && tData instanceof Array && tData.length > 0) {
                var dataFilter = tData.filter(function (s) { return s.InstrumentId == _this.scrollTab.currentId; });
                if (dataFilter.length > 0) {
                    var tData_1 = dataFilter[0];
                    var tLast = parseFloat(tData_1.Last);
                    _this.tickerTLast = tLast;
                    var tPrevClose = parseFloat(tData_1.PrevClose);
                    tData_1.Change = tLast - tPrevClose;
                    tData_1.ChangePercent = (tData_1.Change / tPrevClose) * 100;
                    _this.tickerData = tData_1;
                    _this.getPerformanceData();
                }
            }
            else {
                _this.helper.hideLoading(_this);
            }
        });
    };
    /*--------------END TICKER-----------------------*/
    /*--------------PERFORMANCE DATA-----------------------*/
    ShareGraphPage.prototype.createDefaultPerformanceData = function () {
        this.performanceData = {
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
    ShareGraphPage.prototype.getPerformanceData = function () {
        var _this = this;
        this.performanceService.getPerformanceData(this.scrollTab.currentId).then(function (data) {
            if (data != undefined && data != null) {
                _this.performanceData = _this.processPerformanceData(data);
            }
            else {
                _this.createDefaultPerformanceData();
            }
            if (_this.refresher != null) {
                _this.refresher.complete();
                _this.refresher = null;
            }
            /*else if(loading){
              loading.dismiss();
            }*/
            _this.helper.hideLoading(_this);
        });
    };
    ShareGraphPage.prototype.processPerformanceData = function (data) {
        var _this = this;
        var marketId = 0;
        data.currency = this.globalVars.generalSettings.currency.value;
        var instrument = this.globalVars.configData.common.instruments.filter(function (instrument) { return instrument.instrumentid == _this.scrollTab.currentId; });
        if (instrument.length > 0) {
            marketId = instrument[0].marketid;
            if (this.globalVars.generalSettings.currency.isDefault)
                data.currency = instrument[0].currencycode;
        }
        this.decimalDigits = this.helper.getDecimalDigits(data.currency);
        //Get currency name
        data.currency = this.helper.getCurrencyName(data.currency);
        //Get market name
        data.market = "";
        if (marketId > 0) {
            var market = this.globalVars.configData.common.markets.filter(function (obj) { return obj.id == marketId; });
            if (market.length > 0) {
                data.market = this.helper.getConfigValueByLang(market[0].name);
            }
        }
        //data.NumberOfShares = data.NumberOfShares/this.unitNumberOfShare;
        return data;
    };
    __decorate([
        core_1.ViewChild(scrolltab_1.ScrollTabComponent)
    ], ShareGraphPage.prototype, "scrollTab", void 0);
    ShareGraphPage = __decorate([
        core_1.Component({
            selector: 'page-sharegraph',
            templateUrl: 'sharegraph.html',
            providers: [chart_service_1.ChartService, ticker_service_1.TickerService, performance_service_1.PerformanceService],
        })
    ], ShareGraphPage);
    return ShareGraphPage;
}());
exports.ShareGraphPage = ShareGraphPage;
