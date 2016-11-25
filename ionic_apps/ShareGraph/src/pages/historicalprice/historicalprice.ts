import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
import { HistoricalPriceService } from '../../providers/historicalprice-service';
//import { ScrollTabComponent } from '../../components/scrolltab/scrolltab';
import { HPDetailPage } from './detail-page/detail-page';
//import { HistoricalPriceComponent } from '../../components/historicalprice/historicalprice';

declare var Highcharts: any;

@Component({
    selector: 'page-historicalprice',
    templateUrl: 'historicalprice.html',
    providers: [HistoricalPriceService]
})
export class HistoricalPricePage {

    //@ViewChild(ScrollTabComponent) scrollTab: ScrollTabComponent;

    headerTitle: string;
    selectDateText: string;
    showDataText: string;
    chartTitle: string;
    chartNote: string;
    cancelText: string;
    doneText: string;
    dateFormat: string;
    pickerFormat: string;
    decimalDigits: number;
    monthNames: any;
    monthShortNames: any;
    dayNames: any;
    dayShortNames: any;
    chart: any;
    selectedDate: any;
    maxDate: any;
    selectedDateObj: any;
    currency: string;
    chartOptions: any;
    chartData: any;
    tabData: any;
    currentInstrumentId: number;

    constructor(public nav: NavController, public hpriceService: HistoricalPriceService, public helper: Helper, public globalVars: GlobalVars) {
        this.headerTitle = helper.getPhrase("HistoricalPrice", "Common");
        this.selectDateText = helper.getPhrase("SelectDate", "HistoricalPrice");
        this.showDataText = helper.getPhrase("ShowData", "HistoricalPrice");
        this.chartTitle = helper.getPhrase("AnnualClosePrice", "HistoricalPrice");
        this.chartNote = helper.getPhrase("AnnualClosePriceDesc", "HistoricalPrice");
        this.cancelText = helper.getPhrase("Cancel", "HistoricalPrice");
        this.doneText = helper.getPhrase("Done", "HistoricalPrice");

        this.dateFormat = globalVars.generalSettings.shortDateFormat.toUpperCase();
        this.pickerFormat = globalVars.isArabic ? 'YYYY/MMMM/DD' : 'DD/MMMM/YYYY';
        this.decimalDigits = globalVars.generalSettings.decimalDigits;

        this.monthNames = globalVars.phrasesData.Common.MonthNames;
        this.monthShortNames = globalVars.phrasesData.Common.MonthNamesShort;
        this.dayNames = globalVars.phrasesData.Common.DOWNames;
        this.dayShortNames = globalVars.phrasesData.Common.DOWNames;
    }

    /*Page Events*/
    ionViewDidLoad() {
        this.helper.checkTokenExpired();
        //this.scrollTab.genTabData(this, this.globalVars.configData.common.sharetypes);
        this.genTabData();
    }
    ionViewDidEnter() {
        if (!this.chart) {
            let defaultData = this.globalVars.configData.common.sharetypes[0];
            defaultData.id = defaultData.instrumentid;
            this.selectedTab(defaultData);
        }
        this.helper.checkAppStatus();
    }
    ionViewWillEnter() {
        //Get selected date from detail page
        let currentDate = null;
        if (!this.globalVars.isTablet && this.globalVars.hpSelectedDate && this.globalVars.hpSelectedDate != null) {
            currentDate = new Date(this.globalVars.hpSelectedDate.year.value, (this.globalVars.hpSelectedDate.month.value - 1), this.globalVars.hpSelectedDate.day.value);
            this.globalVars.hpSelectedDate = null;
        }
        else {
            //Get default selected date (is yesterday)
            currentDate = new Date(new Date().setDate(new Date().getDate() - 1));
        }

        this.selectedDate = this.helper.dateFormat(currentDate, this.helper.ISOFormatDate, false);
        this.maxDate = this.selectedDate;
        this.selectedDateObj = {
            year: { value: currentDate.getFullYear() },
            month: { value: currentDate.getMonth() + 1 },
            day: { value: currentDate.getDate() }
        };
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
    /*End Page Events*/

    /*Tab Events*/
    selectedTab(data) {
        this.helper.checkTokenExpired();
        //if (!isIpad)
            this.helper.showLoading(this);
        //this.scrollTab.currentId = data.id;
        this.currentInstrumentId = data.id;
        this.genClosePriceChart();
    }
    /*End Tab Events*/

    /*Show Data*/
    showData() {
        if (this.helper.userTokenHasExpired()) {
            this.helper.showConfirmLogin();
        }
        else {
            let paramData = {
                instrumentId: this.currentInstrumentId,//this.scrollTab.currentId,
                selectedDate: this.selectedDateObj,
                currency: this.currency,
                decimalDigits: this.decimalDigits
            }
            this.nav.push(HPDetailPage, { data: paramData });
        }
    }
    /*End Show Data*/

    /*Date Picker*/
    onChange(date) {
        this.selectedDateObj = date;
        //if (isIpad) {
        //    this.historicalPriceComponent.genHistoricalPriceContent(this.scrollTab.currentId, this.selectedDateObj, this.decimalDigits, this.currency);
        //}
    }
    /*End Date Picker*/

    /*Close Price Chart*/
    genClosePriceChart() {
        if (this.globalVars.generalSettings.currency.isDefault) {
            //let instrument = this.globalVars.configData.common.instruments.filter(instrument => instrument.instrumentid == this.scrollTab.currentId);
            let instrument = this.globalVars.configData.common.instruments.filter(instrument => instrument.instrumentid == this.currentInstrumentId);
            if (instrument.length > 0) {
                this.currency = instrument[0].currencycode;
            }
        }
        else {
            this.currency = this.globalVars.generalSettings.currency.value;
        }
        this.decimalDigits = this.helper.getDecimalDigits(this.currency);

        //this.hpriceService.getClosePriceData(this.scrollTab.currentId).then(data => {
        this.hpriceService.getClosePriceData(this.currentInstrumentId).then(data => {
            if (data != null && data instanceof Array && data.length > 0) {
                this.chartData = { year: [], closePrice: [] };
                for (let i = 0; i < data.length; i++) {
                    let year = data[i].Year;
                    if (i == data.length - 1)
                        this.chartData.year.push(year + "*");
                    else
                        this.chartData.year.push(year);
                    this.chartData.closePrice.push(data[i].ClosePrice);
                }
                setTimeout(() => {
                    this.drawClosePriceChart();
                }, 500);
            }
            else
                this.helper.hideLoading(this);
            //if (isIpad) {
            //    this.historicalPriceComponent.genHistoricalPriceContent(this.scrollTab.currentId, this.selectedDateObj, this.decimalDigits, this.currency);
            //}
        });
    }
    drawClosePriceChart() {
        let $scope = this;
        if (!this.chart) {
            this.chartOptions = {
                chart: {
                    type: 'column',
                    renderTo: "closeprice-chart",
                    spacing: [0, 0, 0, 0],
                    marginTop: 5,
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: 21,
                    backgroundColor: null,
                    reflow: true
                },
                title: {
                    text: null
                },
                xAxis: {
                    tickWidth: 0,
                    categories: this.chartData.year,
                    lineWidth: 0,
                    labels: {
                        formatter: function () {
                            let year = this.value;
                            if ($scope.globalVars.isArabic)
                                year = $scope.helper.convertToArabic(year);
                            return year;
                        }
                    }
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
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            overflow: "none",
                            crop: false,
                            formatter: function () {
                                return $scope.helper.formatNumber(this.y, $scope.decimalDigits);
                            }
                        }
                    }
                },
                tooltip: {
                    enabled: false
                },
                series: [{
                    name: 'ClosePrice',
                    data: this.chartData.closePrice,
                    color: '#AEBBC4'
                }],
                credits: {
                    enabled: false
                }
            };
            this.chart = new Highcharts.Chart(this.chartOptions);
        }
        else {
            this.chart.xAxis[0].setCategories(this.chartData.year);
            this.chart.series[0].setData(this.chartData.closePrice);
        }
        this.helper.hideLoading(this);
    }
    /*End Close Price Chart*/
}
