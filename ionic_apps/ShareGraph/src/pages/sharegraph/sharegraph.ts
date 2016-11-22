import { Component } from '@angular/core';
import { NavController, ModalController, ViewController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { ChartService } from '../../providers/chart-service';
import { TickerService } from '../../providers/ticker-service';
import { PerformanceService } from '../../providers/performance-service';
import { CompareTab } from './comparetab/comparetab';
//import { ScrollTabComponent } from '../../components/scrolltab/scrolltab';
import { ProfileService } from '../../providers/profile-service';

declare var Highcharts: any;

@Component({
    selector: 'page-sharegraph',
    templateUrl: 'sharegraph.html',
    providers: [ChartService, TickerService, PerformanceService],
})
export class ShareGraphPage {
    //@ViewChild(ScrollTabComponent) scrollTab: ScrollTabComponent;
    isTablet: boolean;
    currentPeriod: number = 0;
    decimalDigits: number = 2;
    loading: any = null;
    volumeChartColor: string = "#4572A7";
    priceChartColor: string = "#7EBFEA";
    tickerData: Object = {
        Last: 0,
        High: 0,
        Low: 0,
        Change: 0,
        ChangePercent: 0,
        Volume: 0
    };
    tickerTLast: number = 1;
    refresher: any = null;
    isOnline: boolean = true;
    enableWatchList: boolean = false;
    enableIndices: boolean = false;
    currenInstrument: any;
    currentIntrumenId: number;
    chartInterval: any;
    headerTitle: string;
    compare: string;
    watchlist: string;
    indices: string;
    periods: any;
    unitNumberOfShare: number = 1;
    unitMarketCap: number = 1;
    performancePhrases: Object;
    tickerPhases: Object;
    closeData: any;
    volumeData: any;
    chart: any;
    chartOptions: Object;
    performanceData: any;
    period: number;
    tabData: any;

    constructor(public nav: NavController, public modalController: ModalController, public viewController: ViewController,
        public helper: Helper, public globalVars: GlobalVars, public chartService: ChartService,
        public tickerService: TickerService, public performanceService: PerformanceService,
        public sanitizationService: DomSanitizer, public profileService: ProfileService) {
        this.isTablet = this.globalVars.isTablet;
        if (this.globalVars.configData.sharegraph) {
            if (this.globalVars.configData.sharegraph.defaultperiod)
                this.currentPeriod = this.helper.getDefaultChartPeriod(this.globalVars.configData.sharegraph.defaultperiod);//this.getDefaultPeriodFromConfig();
            if (this.globalVars.configData.sharegraph.pricechartcolor)
                this.priceChartColor = this.globalVars.configData.sharegraph.pricechartcolor;
            if (this.globalVars.configData.sharegraph.volumeChartColor)
                this.volumeChartColor = this.globalVars.configData.sharegraph.volumechartcolor;
        }
        //get all phrases
        this.getPhrasesInPage();
        this.createDefaultPerformanceData();
    }
    
    ionViewDidLoad() {
        //this.scrollTab.genTabData(this, this.globalVars.configData.common.instruments);
        this.genTabData();
    }

    ionViewWillEnter() {
        this.isOnline = this.globalVars.isOnline;
        if (this.globalVars.changedLanguage && this.globalVars.changedLanguage == true) {
            this.viewController.setBackButtonText(this.helper.getPhrase("Back"));
            this.getPhrasesInPage();
        }
        this.enableWatchList = this.profileService.isEnabledWatchlist();
        this.enableIndices = this.profileService.isEnabledIndices();
    }

    ionViewDidEnter() {
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
    }

    ionViewDidLeave() {
        if (this.chartInterval)
            clearInterval(this.chartInterval);
    }

    doRefresh(refresher) {
        if (this.refresher == null) {
            this.refresher = refresher;
            this.selectedTab(this.currenInstrument);
        }
    }

    genTabData() {
        let data = this.globalVars.configData.common.instruments.slice();
        if (data.length > 1) {
            data.forEach((obj) => {
                obj.id = obj["instrumentid"];
                obj.displayName = this.helper.getConfigValueByLang(obj.name);
            });
            this.tabData = data;
        }
    }

    //get chart data
    getChartData() {
        //this.chartService.getChartData(this.scrollTab.currentId, this.currentPeriod).then(data => {
        this.chartService.getChartData(this.currentIntrumenId, this.currentPeriod).then(data => {
            this.genChartData(data);
        });
    }

    genChartData(data) {
        this.closeData = data.close;
        this.volumeData = data.volume;
        if (!this.chart)
            this.generateChart();
        else {
            this.chart.series[0].setData(this.volumeData);
            this.chart.series[1].setData(this.closeData);
        }
    }

    //get all phrase in page
    getPhrasesInPage() {
        this.headerTitle = this.helper.getPhrase("ShareGraph", "Common");
        this.compare = this.helper.getPhrase("Compare", "ShareGraph");
        this.watchlist = this.helper.getPhrase("Watchlist", "ShareGraph");
        this.indices = this.helper.getPhrase("Indices", "ShareGraph");
        let currencyLabel = this.helper.getPhrase("Currency", "ShareGraph");
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
        let nosLabel = "";
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
        let marketCapLabel = "";
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
            sharedataNote: this.sanitizationService.bypassSecurityTrustHtml(this.helper.getPhrase("ShareDataNote", "ShareGraph").replace("<a>", "<a class='link-to-settings' href='javascript:document.getElementById(\"btn_gotosettings\").click();'>")),
            currency: this.sanitizationService.bypassSecurityTrustHtml(currencyLabel),
            prevClose: this.helper.getPhrase("PreviousClose", "ShareGraph"),
            high: this.helper.getPhrase("WeeksHigh52", "ShareGraph"),
            low: this.helper.getPhrase("WeeksLow52", "ShareGraph"),
            weeks: this.helper.getPhrase("WeeksPercent52", "ShareGraph"),
            ytd: this.helper.getPhrase("YTDPercent", "ShareGraph"),
            marketdata: this.helper.getPhrase("MarketData", "ShareGraph"),
            //marketdataNote: this.helper.getPhrase("MarketDataNote", "ShareGraph"),
            //marketdataNote: this.sanitizationService.bypassSecurityTrustHtml(this.helper.getPhrase("MarketDataNote", "ShareGraph").replace("<a>", "<a class='link-to-settings' href='javascript:irApp.root.helper.goToSettings()'>")),
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
    }

    /*-----button events-----*/
    selectedTab(tabData, forceReload = false) {
        this.helper.checkTokenExpired();
        //if (forceReload || (this.refresher != null || tabData.id != this.scrollTab.currentId)) {
        if (forceReload || (this.refresher != null || tabData.id != this.currentIntrumenId)) {
            this.helper.showLoading(this);
            this.currenInstrument = tabData;
            //this.scrollTab.currentId = tabData.id;
            this.currentIntrumenId = tabData.id;
            if (this.currentPeriod > 0) {
                this.selectedPeriod(this.currentPeriod);
            }
            else {
                if (this.globalVars.configData.sharegraph && this.globalVars.configData.sharegraph.defaultperiod)
                    this.selectedPeriod(this.helper.getDefaultChartPeriod(this.globalVars.configData.sharegraph.defaultperiod));
            }
            this.getTickerData();
        }
    }

    selectedPeriod(period, changedInstrument = false) {
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
    }

    goCompare(compareType) {
        if (this.helper.userTokenHasExpired()) {
            this.helper.showConfirmLogin();
        }
        else {
            let compareModal = this.modalController.create(CompareTab, { params: { type: compareType, activeId: this.currenInstrument.id } });
            compareModal.present();
        }
    }
    /*-----end button events-----*/

    /*---------------CHART----------------*/
    generateChart() {
        let sharegraph = this;
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
                    let tooltipDate = new Date(this.x);
                    if (sharegraph.currentPeriod == 1) {
                        tooltipDate = new Date(tooltipDate.getUTCFullYear(), tooltipDate.getUTCMonth(), tooltipDate.getUTCDate(), tooltipDate.getUTCHours(), tooltipDate.getUTCMinutes(), tooltipDate.getUTCSeconds());
                        tooltipDate = sharegraph.helper.dateFormat(tooltipDate, sharegraph.globalVars.generalSettings.longDateFormat + " " + sharegraph.globalVars.generalSettings.timeFormat);
                    }
                    else {
                        tooltipDate = sharegraph.helper.dateFormat(tooltipDate, sharegraph.globalVars.generalSettings.longDateFormat);
                    }
                    let s = '<span class="sg-tooltip-date">' + tooltipDate + '</span>';
                    this.points.reverse().forEach(function (point) {
                        let value = sharegraph.helper.formatNumber(point.y, point.series.index == 0 ? 0 : sharegraph.decimalDigits);
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
                data: sharegraph.volumeData//(sgobj.chartOptions == null ? arrayVolumeFiltered : [])
            }, {
                    name: sharegraph.helper.getPhrase("Price", "ShareGraph"),
                    type: 'area',
                    animation: false,
                    threshold: null,
                    marker: {
                        enabled: false
                    },
                    data: sharegraph.closeData//(sgobj.chartOptions == null ? arrayCloseFiltered : [])
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
        Highcharts.setOptions({
            lang: {
                shortMonths: sharegraph.helper.getPhrase("MonthNamesShort", "Common"),
                weekdays: sharegraph.helper.getPhrase("DOWNames", "Common")
            }
        });
        this.chart = new Highcharts.StockChart(this.chartOptions);
    }
    setChartInterval() {
        if (this.chartInterval)
            clearInterval(this.chartInterval);
        this.chartInterval = setInterval(() => {
            //let instrument = this.globalVars.configData.common.instruments.filter(s => s.instrumentid == this.scrollTab.currentId);
            let instrument = this.globalVars.configData.common.instruments.filter(s => s.instrumentid == this.currentIntrumenId);
            if (instrument.length > 0) {
                let marketId = instrument[0].marketid;
                if (!this.helper.getMarketStatus(marketId))
                    return;
            }
            this.getTickerData();
            if (this.currentPeriod == 1) {
                this.getChartData();
            }
        }, this.globalVars.sharegraph.timeInterval);
    }
    /*--------------END CHART------------*/

    /*--------------TICKER-----------------------*/
    getTickerData() {
        this.tickerService.getTickerData().then((tData) => {
            if (tData != null && tData instanceof Array && tData.length > 0) {
                //let dataFilter = tData.filter(s => s.InstrumentId == this.scrollTab.currentId);
                let dataFilter = tData.filter(s => s.InstrumentId == this.currentIntrumenId);
                if (dataFilter.length > 0) {
                    let tData = dataFilter[0];

                    let tLast = parseFloat(tData.Last);
                    this.tickerTLast = tLast;
                    let tPrevClose = parseFloat(tData.PrevClose);
                    tData.Change = tLast - tPrevClose;
                    tData.ChangePercent = (tData.Change / tPrevClose) * 100;

                    this.tickerData = tData;

                    this.getPerformanceData();
                }
            }
            else {
                this.helper.hideLoading(this);
            }
        });
    }
    /*--------------END TICKER-----------------------*/

    /*--------------PERFORMANCE DATA-----------------------*/
    createDefaultPerformanceData() {
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
    }
    getPerformanceData() {
        //this.performanceService.getPerformanceData(this.scrollTab.currentId).then(data => {
        this.performanceService.getPerformanceData(this.currentIntrumenId).then(data => {
            if (data != undefined && data != null) {
                this.performanceData = this.processPerformanceData(data);
            }
            else {
                this.createDefaultPerformanceData();
            }
            if (this.refresher != null) {
                this.refresher.complete();
                this.refresher = null;
            }
            /*else if(loading){
              loading.dismiss();
            }*/
            this.helper.hideLoading(this);
        });
    }
    processPerformanceData(data) {
        let marketId = 0;
        data.currency = this.globalVars.generalSettings.currency.value;
        //let instrument = this.globalVars.configData.common.instruments.filter(instrument => instrument.instrumentid == this.scrollTab.currentId);
        let instrument = this.globalVars.configData.common.instruments.filter(instrument => instrument.instrumentid == this.currentIntrumenId);
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
            let market = this.globalVars.configData.common.markets.filter(obj => obj.id == marketId);
            if (market.length > 0) {
                data.market = this.helper.getConfigValueByLang(market[0].name);
            }
        }

        //data.NumberOfShares = data.NumberOfShares/this.unitNumberOfShare;
        return data;
    }
    /*--------------END PERFORMANCE DATA-----------------------*/

    goToSettingsPage() {
        this.helper.goToSettings();
    }
}
