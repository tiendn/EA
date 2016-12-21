import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Helper } from '../../common/helper';
import { GlobalVars } from '../../common/global-vars';
//import { ScrollTabComponent } from '../../components/scrolltab/scrolltab';
import { ICalDetailPage } from './detail-page/detail-page';
import { ICalDetailComponent } from './component/detail-component';

@Component({
    selector: 'page-investmentcalculator',
    templateUrl: 'investmentcalculator.html'
    //templateUrl: (function () {
    //    return 'investmentcalculator.html';
    //} ()),
})
export class InvestmentCalculatorPage {

    //@ViewChild(ScrollTabComponent) scrollTab: ScrollTabComponent;
    @ViewChild(ICalDetailComponent) iCalDetailComponent: ICalDetailComponent;

    form: any;
    headerTitle: string;
    investmentPeriodText: string;
    startDateText: string;
    endDateText: string;
    noOfShareText: string;
    amountText: string;
    dividendText: string;
    showDataText: string;
    cancelText: string;
    doneText: string;
    sharesText: string;
    noOfSharesMess: string;
    showNoOfSharesMess: boolean;
    amountMess: string;
    showAmountMess: boolean;
    currency: string;
    currentStartDate: Object;
    selectedStartDate: string;
    currentEndDate: Object;
    selectedEndDate: string;
    maxStartDate: string;
    maxEndDate: string;
    minEndDate: string;
    dateFormat: string;
    pickerFormat: string;
    decimalDigits: number;
    isAmount: boolean;
    thousandSeparator: string;
    decimalSeparator: string;
    regexThousandSeparator: any;
    regexDecimalSeparator: any;
    keyPressCodeDecimalSeperator: any;
    keyUpCodeDecimalSeperator: any;
    monthNames: any;
    monthShortNames: any;
    dayNames: any;
    dayShortNames: any;
    selectedInput: any;
    prevValue: any;
    tabData: any;
    currentInstrumentId: number;

    constructor(public nav: NavController, public helper: Helper, public formBuilder: FormBuilder, public globalVars: GlobalVars, public view: ViewController) {
        this.form = formBuilder.group({
            startDate: "",
            endDate: "",
            noOfShares: "",
            amount: "",
            dividends: false
        });

        this.getPhrases();

        this.showNoOfSharesMess = false;
        this.showAmountMess = false;
        this.currency = "";

        //Start Date
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        let prevYear = new Date(yesterday.setFullYear(yesterday.getFullYear() - 1));
        this.currentStartDate = {
            year: { value: prevYear.getFullYear() },
            month: { value: prevYear.getMonth() + 1 },
            day: { value: prevYear.getDate() }
        };
        this.selectedStartDate = this.helper.dateFormat(prevYear, this.helper.ISOFormatDate, false);
        //End Date
        let defaultEndDate = new Date(new Date().setDate(new Date().getDate() - 1));
        this.currentEndDate = {
            year: { value: defaultEndDate.getFullYear() },
            month: { value: defaultEndDate.getMonth() + 1 },
            day: { value: defaultEndDate.getDate() }
        };
        this.selectedEndDate = this.helper.dateFormat(defaultEndDate, this.helper.ISOFormatDate, false);

        this.maxStartDate = this.selectedEndDate;
        this.maxEndDate = this.selectedEndDate;
        this.minEndDate = this.selectedStartDate;

        this.dateFormat = helper.getDatePickerFormat();
        this.pickerFormat = globalVars.isArabic ? 'YYYY/MMMM/DD' : 'DD/MMMM/YYYY';
        this.decimalDigits = globalVars.generalSettings.decimalDigits;
        this.isAmount = false;

        this.thousandSeparator = globalVars.generalSettings.separator.thousand;
        this.decimalSeparator = globalVars.generalSettings.separator.decimal;

        //Regex
        this.regexThousandSeparator = new RegExp('\\' + this.globalVars.generalSettings.separator.thousand, 'g');
        this.regexDecimalSeparator = new RegExp('\\' + this.globalVars.generalSettings.separator.decimal, 'g');

        if (this.globalVars.generalSettings.separator.decimal == ".") {
            this.keyPressCodeDecimalSeperator = [46];
            this.keyUpCodeDecimalSeperator = [110, 190];
        }
        else {
            this.keyPressCodeDecimalSeperator = [44];
            this.keyUpCodeDecimalSeperator = [188];
        }
        //this.helper.updateDateTimeConfig();
    }

    getPhrases() {
        this.headerTitle = this.helper.getPhrase("InvestmentCalculator", "Common");
        this.investmentPeriodText = this.helper.getPhrase("InvestmentPeriod", "InvestmentCalculator");
        this.startDateText = this.helper.getPhrase("StartDate", "InvestmentCalculator");
        this.endDateText = this.helper.getPhrase("EndDate", "InvestmentCalculator");
        this.noOfShareText = this.helper.getPhrase("EnterNoOfShare", "InvestmentCalculator");
        this.amountText = this.helper.getPhrase("EnterAmount", "InvestmentCalculator");
        this.dividendText = this.helper.getPhrase("DividendsReinvested", "InvestmentCalculator");
        this.showDataText = this.helper.getPhrase("ShowData", "InvestmentCalculator");
        this.cancelText = this.helper.getPhrase("Cancel", "InvestmentCalculator");
        this.doneText = this.helper.getPhrase("Done", "InvestmentCalculator");
        this.sharesText = this.helper.getPhrase("Shares", "InvestmentCalculator");
        this.noOfSharesMess = this.helper.getPhrase("ErrorNoOfShares", "InvestmentCalculator");
        this.amountMess = this.helper.getPhrase("ErrorAmount", "InvestmentCalculator");
        this.monthNames = this.globalVars.phrasesData.Common.MonthNames;
        this.monthShortNames = this.globalVars.phrasesData.Common.MonthNamesShort;
        this.dayNames = this.globalVars.phrasesData.Common.DOWNames;
        this.dayShortNames = this.globalVars.phrasesData.Common.DOWNames;
    }

    /*Page Events*/
    ionViewDidLoad() {
        this.helper.checkTokenExpired();
        //this.scrollTab.genTabData(this, this.globalVars.configData.common.sharetypes);
        this.genTabData();
        let defaultData = this.globalVars.configData.common.sharetypes[0];
        defaultData.id = defaultData.instrumentid;
        this.getCurrency(defaultData.instrumentid);
        this.selectedTab(defaultData);
    }

    /*Changed Settings*/
    ionViewWillEnter() {
        if (this.globalVars.changedLanguage) {
            this.getPhrases();
            this.view.setBackButtonText(this.helper.getPhrase("Back"));
            if (this.globalVars.isIpad) {
                this.iCalDetailComponent.getPhrases();
                this.iCalDetailComponent.getInstrumentName();
            }
        }
        if (this.globalVars.changedCurrency) {
            if (this.currentInstrumentId)
                this.getCurrency(this.currentInstrumentId);
        }
        else if (this.globalVars.changedDecimalSeparator) {
            //if (this.chart && this.chartData) {
            //    this.chart.series[0].setData([]);
            //    setTimeout(() => {
            //        this.chart.series[0].setData(this.chartData.closePrice);
            //    }, 100);
            //}
            //if (this.globalVars.isIpad) {
            //    this.hpDetailComponent.refreshHistoricalPriceContent();
            //}
        }
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

    getCurrency(instrumentid) {
        let currency = "";
        if (!this.globalVars.generalSettings.currency.isDefault)
            currency = this.globalVars.generalSettings.currency.value;
        else {
            let dataFilter = this.globalVars.configData.common.instruments.filter(ins => ins.instrumentid == instrumentid);
            if (dataFilter.length > 0) {
                //this.instrumentName = this.helper.getConfigValueByLang(dataFilter[0].name);
                //if(this.unit == "")
                currency = dataFilter[0].currencycode;
            }
        }
        this.currency = this.helper.getCurrencyName(currency);
        if (this.globalVars.isIpad && this.iCalDetailComponent.icalData)
            this.onSubmit(this.form.value);
    }
    /*End Page Events*/

    /*Tab Events*/
    selectedTab(data) {
        if (data.id != this.currentInstrumentId) {
            this.helper.checkTokenExpired();
            //if (!this.globalVars.isIpad)
            //    this.helper.showLoading(this);
            //this.scrollTab.currentId = data.id;
            this.currentInstrumentId = data.id;
            this.getCurrency(data.id);
            //this.genClosePriceChart();
        }
    }
    /*End Tab Events*/

    /*Change Date Picker*/
    onStartDateChange(date) {
        if (this.currentStartDate["year"].value != date.year.value || this.currentStartDate["month"].value != date.month.value || this.currentStartDate["day"].value != date.day.value) {
            this.currentStartDate = date;
            this.minEndDate = this.helper.dateFormat(new Date(date.year.value, date.month.value - 1, date.day.value), this.helper.ISOFormatDate, false);
        }
    }
    onEndDateChange(date) {
        if (this.currentEndDate["year"].value != date.year.value || this.currentEndDate["month"].value != date.month.value || this.currentEndDate["day"].value != date.day.value) {
            this.currentEndDate = date;
            this.maxStartDate = this.helper.dateFormat(new Date(date.year.value, date.month.value - 1, date.day.value), this.helper.ISOFormatDate, false);
        }
    }
    /*End Change Date Picker*/

    /*Show Data*/
    onSubmit(data) {
        if (this.helper.userTokenHasExpired()) {
            this.helper.showConfirmLogin();
        }
        else {
            //Validate form
            if (this.isAmount) {
                if (data.amount.length == 0) {
                    this.showAmountMess = true;
                    return;
                }
                else
                    this.showAmountMess = false;
                if (this.globalVars.isArabic)
                    data.amount = this.helper.convertToEng(data.amount);
                data.amount = data.amount.replace(this.regexThousandSeparator, "").replace(",", ".");
            }
            else {
                if (data.noOfShares.length == 0) {
                    this.showNoOfSharesMess = true;
                    return;
                }
                else
                    this.showNoOfSharesMess = false;
                if (this.globalVars.isArabic)
                    data.noOfShares = this.helper.convertToEng(data.noOfShares);
                data.noOfShares = data.noOfShares.replace(this.regexThousandSeparator, "").replace(",", ".");
            }
            //data.instrumentid = this.scrollTab.currentId;
            data.instrumentid = this.currentInstrumentId;
            data.getByAmount = this.isAmount;

            data.unit = this.currency;
            if (!this.globalVars.isIpad) {
                this.nav.push(ICalDetailPage, { inputData: data });
            }
            else {
                this.iCalDetailComponent.getICalData(data);
            }
        }
    }
    /*End Show Data*/

    /*Input Events*/
    onFocus(isAmount) {
        this.isAmount = isAmount;
        if (isAmount)
            this.selectedInput = document.getElementById("txt_amount").getElementsByTagName('input')[0];
        else
            this.selectedInput = document.getElementById("txt_noofshares").getElementsByTagName('input')[0];
        this.showAmountMess = false;
        this.showNoOfSharesMess = false;
    }

    //Keypress event
    onKeyPress(event) {
        //let code = event.charCode ? event.charCode : event.keyCode;
        let code = event.keyCode || event.which;
        if (!this.isAmount) {
            if ((code >= 48 && code <= 57) || (code >= 1632 && code <= 1641)) {
                return true;
            }
            else {
                event.preventDefault();
                return false;
            }
        }
        else {
            if (this.keyPressCodeDecimalSeperator.indexOf(code) >= 0 || (code >= 48 && code <= 57) || (code >= 1632 && code <= 1641)) {
                let currentValue = event.target.value;
                let cursorPosition = this.getCursorPosition(currentValue);
                //set decimal places = 2
                if (currentValue.indexOf(this.decimalSeparator) > 0 && currentValue.split(this.decimalSeparator)[1].length >= 2
                    && (cursorPosition < 0 || cursorPosition > currentValue.indexOf(this.decimalSeparator))) {
                    event.preventDefault();
                    return false;
                }
                else if (this.keyPressCodeDecimalSeperator.indexOf(code) >= 0 && event.target.value.indexOf(this.globalVars.generalSettings.separator.decimal) > 0) {
                    event.preventDefault();
                    return false;
                }
                else
                    return true;
            }
            else {
                event.preventDefault();
                return false;
            }
        }
    }

    //Keyup event
    onKeyUp(event) {
        let code = event.keyCode || event.which;

        if (code == 0 || code == 229) {
            code = this.getKeyCode(event.target.value);
        }

        let currentValue = event.target.value.trim();
        if (this.globalVars.isArabic) {
            currentValue = this.helper.convertToEng(currentValue);
        }

        let cursorPosition = this.getCursorPosition(currentValue);

        let rawValue = currentValue.replace(this.regexThousandSeparator, "");

        let currenValueFormated = this.helper.formatNumber(parseFloat(rawValue), 0);

        let prevValueCount = -1;
        let curValueCount = 0;

        if (this.prevValue) {
            prevValueCount = this.prevValue.split(this.globalVars.generalSettings.separator.thousand).length;
            curValueCount = currenValueFormated.split(this.globalVars.generalSettings.separator.thousand).length;
        }

        if (prevValueCount >= 0) {
            if (code == 8) { //backspace
                if (this.prevValue == currenValueFormated) {
                    cursorPosition = cursorPosition - 1;
                    let cValue = event.target.value.substring(0, cursorPosition) + event.target.value.substring(cursorPosition + 1, event.target.value.length);
                    rawValue = cValue.replace(this.regexThousandSeparator, "");
                }
                else {
                    if (curValueCount < prevValueCount)
                        cursorPosition = cursorPosition - 1;
                    else if (curValueCount > prevValueCount)
                        cursorPosition = cursorPosition + 1;
                    //amount case
                    if (currentValue.indexOf(this.decimalSeparator) > 0 && (cursorPosition < 0 || cursorPosition > currentValue.indexOf(this.decimalSeparator))) {
                        if (currentValue.split(this.decimalSeparator)[1].length == 0) {
                            if (cursorPosition > 0)
                                cursorPosition = cursorPosition - 1;
                            rawValue = rawValue.replace(this.decimalSeparator, "");
                        }
                    }
                }
            }
            else if (code == 46) { //delete
                if (this.prevValue == currenValueFormated) {
                    if (curValueCount < prevValueCount)
                        cursorPosition = cursorPosition - 1;
                    let cValue = event.target.value.substring(0, cursorPosition - 1) + event.target.value.substring(cursorPosition, event.target.value.length);
                    rawValue = cValue.replace(this.regexThousandSeparator, "");
                }
                else {
                    if (curValueCount < prevValueCount)
                        cursorPosition = cursorPosition - 1;
                    let subVal = currenValueFormated.substring(cursorPosition, currenValueFormated.length);
                    if (Number(subVal.slice(0, 1)))//not number
                        cursorPosition = cursorPosition + 1;
                }
            }
            else if (cursorPosition > 0) { //other keys
                if (curValueCount > prevValueCount)
                    cursorPosition = cursorPosition + 1;
            }
        }
        //console.log(code);
        //console.log(this.keyCodeDecimalSeperator.indexOf(code));

        if (rawValue.length > 0 && this.keyUpCodeDecimalSeperator.indexOf(code) < 0) {
            if (rawValue.indexOf(this.decimalSeparator) > 0) {
                //console.log(rawValue.split(this.decimalSeparator)[0]);
                event.target.value = this.helper.formatNumber(parseFloat(rawValue.split(this.decimalSeparator)[0]), 0) + this.decimalSeparator + rawValue.split(this.decimalSeparator)[1];
                //event.target.value = this.helper.formatNumber(parseFloat(rawValue), 2);
            }
            else
                event.target.value = this.helper.formatNumber(parseFloat(rawValue), 0);
            //console.log(event);
            //if(typeof(event.setFocus()) == "function")
            //event.setFocus();

            //this.selectedInput.focus();
        }
        if (cursorPosition > 0) {
            //console.log(cursorPosition);
            this.setCursorPosition(cursorPosition);
        }
        this.prevValue = event.target.value;
    }
    onKeyDown(event) {
        if (event.keyCode == 13) {
            this.onSubmit(this.form.value);
        }
    }

    getKeyCode(str) {
        return str.charCodeAt(str.length - 1);
    }

    getCursorPosition(val) {
        var el = this.selectedInput;
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document["selection"].createRange();
            var SelLength = document["selection"].createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        if (pos < val.length)
            return pos;
        else
            return -1;
    }

    setCursorPosition(pos) {
        var el = this.selectedInput;
        if (el.setSelectionRange) {
            el.setSelectionRange(pos, pos);
        }
        else if (el.createTextRange) {
            var range = el.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
    /*End Input Events*/

}
