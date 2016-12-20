import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Helper } from '../../../common/helper';
import { GlobalVars } from '../../../common/global-vars';
import { HistoricalPriceService } from '../../../providers/historicalprice-service';
import { PressReleasesService } from '../../../providers/pressreleases-service';
import { ProfileService } from '../../../providers/profile-service';
import { PressReleasesDetailPage } from '../../pressreleases/detail-page/detail-page';
import { PressReleasesDetailComponent } from '../../pressreleases/component/detail-component';
import { HPWatchListPage } from '../watchlist/watchlist';

declare var Highcharts: any;

@Component({
    selector: 'historicalprice-detail',
    templateUrl: 'detail-component.html',
    providers: [HistoricalPriceService, PressReleasesService]
})

export class HPDetailComponent {

    @ViewChild(PressReleasesDetailComponent) prDetailComponent: PressReleasesDetailComponent;

    selectDateText: string;
    cancelText: string;
    doneText: string;
    maxDate: string;
    dateFormat: string;
    pickerFormat: string;
    chartDateFormat: string;
    isIpad: boolean;
    messNoData: string;
    isFirstLoad: boolean;
    showHPDetail: boolean;
    enableWatchList: boolean;
    backText: string;
    monthNames: any;
    monthShortNames: any;
    dayNames: any;
    dayShortNames: any;
    hpData: any;
    phrases: any;
    selectedDateObj: Object;
    noDataText: any;
    showMessNoData: boolean = false;
    instrumentId: number;
    selectedDate: any;
    decimalDigits: number;
    currency: string;
    paramDate: any;
    instrumentName: string;
    chartData: any;
    chartOptions: Object;
    chart: any;
    prData: any;

    constructor(public nav: NavController, public helper: Helper, public modalController: ModalController,
        public profileService: ProfileService, public globalVars: GlobalVars, public domSanitizationService: DomSanitizer,
        public historicalPriceService: HistoricalPriceService, public pressReleasesService: PressReleasesService) {
        this.maxDate = this.helper.dateFormat(new Date(new Date().setDate(new Date().getDate() - 1)), this.helper.ISOFormatDate, false);
        this.dateFormat = helper.getDatePickerFormat();
        this.pickerFormat = globalVars.isArabic ? 'YYYY/MMMM/DD' : 'DD/MMMM/YYYY';
        this.getPhrases();
        this.setDefaultData();
        this.chartDateFormat = this.helper.getDateFormatWithoutYear();
        this.isIpad = globalVars.isIpad;
        this.isFirstLoad = true;
        this.showHPDetail = true;
        this.enableWatchList = profileService.isEnabledWatchlist();
    }

    setDefaultData() {
        this.hpData = {
            Instrument: "",
            Close: "",
            Open: "",
            High: "",
            Low: "",
            Volume: ""
        };
    }

    getPhrases() {
        this.selectDateText = this.helper.getPhrase("SelectDate", "HistoricalPrice");
        this.cancelText = this.helper.getPhrase("Cancel", "HistoricalPrice");
        this.doneText = this.helper.getPhrase("Done", "HistoricalPrice");
        this.messNoData = this.helper.getPhrase("MsgNoData", "HistoricalPrice");
        if (this.isIpad) {
            this.backText = this.helper.getPhrase("Back", "Common")
        }
        this.phrases = {
            instrument: this.helper.getPhrase("Instrument", "HistoricalPrice"),
            closePrice: this.helper.getPhrase("ClosePrice", "HistoricalPrice"),
            open: this.helper.getPhrase("Open", "HistoricalPrice"),
            high: this.helper.getPhrase("DayHigh", "HistoricalPrice"),
            low: this.helper.getPhrase("DayLow", "HistoricalPrice"),
            volume: this.helper.getPhrase("Volume", "HistoricalPrice"),
            compare: this.helper.getPhrase("Compare", "HistoricalPrice"),
            watchlist: this.helper.getPhrase("Watchlist", "HistoricalPrice"),
            chartTitle: this.helper.getPhrase("FiveDayPatterns", "HistoricalPrice")
        };
        this.monthNames = this.globalVars.phrasesData.Common.MonthNames;
        this.monthShortNames = this.globalVars.phrasesData.Common.MonthNamesShort;
        this.dayNames = this.globalVars.phrasesData.Common.DOWNames;
        this.dayShortNames = this.globalVars.phrasesData.Common.DOWNames;
    }

    showNoDataMess() {
        let date = this.helper.dateFormat(new Date(this.selectedDateObj["year"].value, (this.selectedDateObj["month"].value - 1), this.selectedDateObj["day"].value), this.globalVars.generalSettings.shortDateFormat, false);
        this.noDataText = this.domSanitizationService.bypassSecurityTrustHtml(this.messNoData.replace("{0}", date));
        this.showMessNoData = true;
        this.showHPDetail = true;
        this.helper.hideLoading(this);
    }

    refreshHistoricalPriceContent() {
        this.setDefaultData();
        this.getSharePriceData();
    }

    genHistoricalPriceContent(instrumentId, selectedDate, decimalDigits, currency) {
        //this.helper.showLoading(this);
        if (this.isIpad)
            this.helper.showLoading(this, "loading-right");
        else
            this.helper.showLoading(this);
        this.instrumentId = instrumentId;
        this.selectedDateObj = selectedDate;
        if (!this.selectedDate) {
            this.selectedDate = this.helper.dateFormat(new Date(selectedDate.year.value, (selectedDate.month.value - 1), selectedDate.day.value), this.helper.ISOFormatDate, false);
        }
        this.decimalDigits = decimalDigits;
        this.currency = currency;
        this.getSharePriceData();
    }

    getSharePriceData() {
        let currentDate = new Date(this.selectedDateObj["year"].value, (this.selectedDateObj["month"].value - 1), this.selectedDateObj["day"].value);
        this.paramDate = this.helper.dateFormat(currentDate, this.helper.paramDateFormat, false);
        //get instrument name
        //let instrumentName = "";
        //if (this.globalVars.configData.common.instruments.length > 0) {
        //    let dataFilter = this.globalVars.configData.common.instruments.filter(ins => ins.instrumentid == this.instrumentId);
        //    if (dataFilter.length > 0)
        //        instrumentName = this.helper.getConfigValueByLang(dataFilter[0].name);
        //}
        this.getInstrumentName();

        this.historicalPriceService.getHistoricalPriceData(this.instrumentId, this.paramDate).then(data => {
            if (data != null && data instanceof Array && data.length > 0) {
                let dataFilter = data.filter(obj => new Date(obj.Date).toDateString() == currentDate.toDateString());
                if (dataFilter.length > 0) {
                    this.showMessNoData = false;
                    this.hpData = dataFilter[0];
                    //Draw chart
                    setTimeout(() => {
                        this.drawFiveDayChart(data);
                    }, 200);
                    //get PR data
                    let sDate = this.helper.dateFormat(new Date(data[0].Date), this.helper.paramDateFormat, false);
                    let eDate = this.helper.dateFormat(new Date(data[data.length - 1].Date), this.helper.paramDateFormat, false);
                    this.getPRData(sDate, eDate);
                }
                else
                    this.showNoDataMess();
            }
            else
                this.showNoDataMess();
            //this.setDefaultData();
            if (this.isFirstLoad)
                this.isFirstLoad = false;
        });
    }

    getInstrumentName() {
        let instrumentName = "";
        if (this.globalVars.configData.common.instruments.length > 0) {
            let dataFilter = this.globalVars.configData.common.instruments.filter(ins => ins.instrumentid == this.instrumentId);
            if (dataFilter.length > 0)
                instrumentName = this.helper.getConfigValueByLang(dataFilter[0].name);
        }
        this.instrumentName = instrumentName;
    }

    onChange(date) {
        let prevDate = this.selectedDateObj["year"].value + "-" + this.selectedDateObj["month"].value + "-" + this.selectedDateObj["day"].value;
        let currentDate = date.year.value + "-" + date.month.value + "-" + date.day.value;
        if (prevDate != currentDate) {
            this.helper.showLoading(this);
            this.selectedDateObj = date;
            if (!this.isIpad)
                this.globalVars.hpSelectedDate = this.selectedDateObj;
            this.getSharePriceData();
        }
    }

    /*Five day Chart*/
    drawFiveDayChart(data) {
        this.chartData = { date: [], data: [], colors: [] };
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let date = new Date(item.Date).getTime();
            this.chartData.date.push(date);
            this.chartData.data.push([date, item.Open, item.High, item.Low, item.Close]);
            if ((parseFloat(item.Open) - parseFloat(item.Close)) >= 0) {
                this.chartData.colors.push("#AD2233");
            }
            else {
                this.chartData.colors.push("#7ED321");
            }
        }

        let $scope = this;
        //if(!this.chart){
        this.chartOptions = {
            chart: {
                pinchType: "",
                renderTo: "fiveday-chart"
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
            },
            xAxis: {
                lineWidth: 0,
                tickLength: 0,
                labels: {
                    useHTML: true,
                    formatter: function () {
                        let currentDate = $scope.helper.dateFormat(new Date(this.value), $scope.chartDateFormat);
                        if (Highcharts.dateFormat('%Y-%m-%d', this.value).toString() == $scope.selectedDate)
                            return "<span class='candlestick-currentdate'>" + currentDate + "</span>";
                        else
                            return currentDate;
                    }
                },
                tickPositions: this.chartData.date
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0
            },
            credits: {
                enabled: false
            },
            series: [{
                type: 'candlestick',
                name: 'Historical Price',
                data: this.chartData.data,
                marker: {
                    lineWidth: 3,
                    radius: 5.5
                }
            }],
            plotOptions: {
                candlestick: {
                    dataGrouping: {
                        enabled: false
                    },
                    colors: this.chartData.colors,
                    colorByPoint: true,
                    upColor: '#7ED321',
                    color: '#AD2233'
                }
            },
            tooltip: {
                animation: false,
                useHTML: true,
                shared: true,
                crosshairs: true,
                shadow: false,
                followTouchMove: false,
                borderWidth: 0,
                borderRadius: 4,
                style: {
                    padding: 0,
                    margin: 0
                },
                shape: "square",
                formatter: function () {
                    let s = ' ';
                    this.points.forEach(function (series) {
                        let open = $scope.helper.formatNumber(series.point.open, $scope.decimalDigits);
                        let close = $scope.helper.formatNumber(series.point.close, $scope.decimalDigits);
                        let high = $scope.helper.formatNumber(series.point.high, $scope.decimalDigits);
                        let low = $scope.helper.formatNumber(series.point.low, $scope.decimalDigits);
                        s += "<div class='hp-result-tooltip' style='border: 1px solid " + series.point.color + "'>" +
                            "<div><span class='tooltip-label'>" + $scope.helper.getPhrase("Open", "Common") + "</span><span class='tooltip-value'> " + open + "</span></div>" +
                            "<div><span class='tooltip-label'>" + $scope.helper.getPhrase("Close", "Common") + "</span><span class='tooltip-value'> " + close + "</span></div>" +
                            "<div><span class='tooltip-label'>" + $scope.helper.getPhrase("High", "Common") + "</span><span class='tooltip-value'> " + high + "</span></div>" +
                            "<div><span class='tooltip-label'>" + $scope.helper.getPhrase("Low", "Common") + "</span><span class='tooltip-value'> " + low + "</span></div>" +
                            "</div>";
                    });

                    return s;
                }
            }
        };
        this.chart = new Highcharts.StockChart(this.chartOptions);
        //}
        //else{
        //    this.chart.xAxis[0].setTickPositions(this.chartData.date);
        //    this.chart.series[0].setData(this.chartData.data);
        //}
        this.helper.hideLoading(this);
    }
    /*End Five day Chart*/

    /*Get Press Releases Data*/
    getPRData(sDate, eDate) {
        this.pressReleasesService.getPressReleasesByDate(sDate, eDate).then(data => {
            if (data != null && data instanceof Array && data.length > 0) {
                data.forEach(obj => {
                    obj.DisplayDate = this.getDisplayDate(obj.DateNumeric.toString());
                });
                this.prData = data;
            }
            else {
                this.prData = null;
            }
            this.showHPDetail = true;
            this.helper.hideLoading(this);
        });
    }
    getDisplayDate(dateNumeric) {
        let displayDate = new Date(dateNumeric.slice(0, 4), (parseFloat(dateNumeric.slice(4, 6)) - 1), dateNumeric.slice(6, 8));
        return this.helper.dateFormat(displayDate, this.globalVars.generalSettings.longDateFormat);
    }
    getPRDetail(prItem) {
         if (!this.isIpad) {
             this.nav.push(PressReleasesDetailPage, { prData: prItem });
         }
         else {
             this.prDetailComponent.getPrDetailData(prItem);
             this.showHPDetail = false;
         }
    }
    backToHistoricalPrice() {
        this.showHPDetail = true;
    }
    /*End Get Press Releases Data*/

    /*Watchlist*/
    goWatchlist() {
        let params = {
            instrumentId: this.instrumentId,
            selectedDate: this.selectedDateObj,
            paramDate: this.paramDate,
            decimalDigits: this.decimalDigits
        }
        let watchlistModal = this.modalController.create(HPWatchListPage, { data: params });
        watchlistModal.onDidDismiss(data => {
            if (data && data.goToSettings)
                this.helper.goToSettings();
        });
        watchlistModal.present();
    }
}
