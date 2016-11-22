import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../common/global-vars';
import { Helper } from '../common/helper';
import 'rxjs/Rx';

@Injectable()
export class ChartService {
    apiName = "chartdata";
    servicesUrl: string; 
    defaultHisoryDateFormat = "yyyymmdd";
    defaultDailyDateFormat = "yyyymmdd HHMMss";
    historyKey = "history";
    dailyKey = "daily";
    storageData: any;
    resolve: any;
    isPercentData: boolean;
    historyStorageKey: string;
    dailyStorageKey: string;
    chartData: any;

    constructor(public http: Http, public storage: Storage, public globalVars: GlobalVars, public helper: Helper) {
        //this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/";
    }

    getChartData(instrumentId, period, isPercentData = false, fDate = null) {
        return new Promise(resolve => {
            this.resolve = resolve;
            this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/";
            if (period == 1)
                this.getDailyData(instrumentId, isPercentData, fDate);
            else
                this.getHistoryData(instrumentId, period, isPercentData);
        });
    }

    /*---------------------------HISTORY---------------------------------*/
    getHistoryData(instrumentId, period, isPercentData = false) {
        this.isPercentData = isPercentData;
        this.historyStorageKey = this.apiName + "_" + this.historyKey + "_" + this.globalVars.generalSettings.currency.value;
        this.storage.get(this.historyStorageKey).then((sData) => {
            var fDate = this.getFromDate(period);
            var tDate = new Date();
            if (sData != null) {
                var storageData = sData;
                var TTL = this.globalVars.sharegraph.historyStorageTTL;
                if (TTL <= (new Date().getTime() - storageData.cacheTime)) {
                    this.getHistoryDataFromServices(instrumentId, fDate, tDate, null);
                }
                else {
                    if (storageData[instrumentId] != undefined && storageData[instrumentId] != null && storageData[instrumentId].length > 0) {
                        var schartData = storageData[instrumentId];
                        var sminDate = new Date(new Date(schartData[0].Date).setHours(0, 0, 0, 0));
                        if (fDate < sminDate) {
                            this.getHistoryDataFromServices(instrumentId, fDate, sminDate, storageData, true);
                        }
                        else {
                            var chartDataFilter = schartData.filter(cData => new Date(cData.Date) >= fDate);
                            if (chartDataFilter.length > 0) {
                                this.processData(chartDataFilter);
                                this.resolve(this.chartData);
                            }
                        }
                    }
                    else
                        this.getHistoryDataFromServices(instrumentId, fDate, tDate, storageData);
                }
            }
            else {
                this.getHistoryDataFromServices(instrumentId, fDate, tDate, null);
            }
        });
    }

    getHistoryDataFromServices(instrumentId, fDate, tDate, currentStorageData, isAppend = false) {
        let storageData = currentStorageData;
        if (this.globalVars.isOnline) {
            var params = instrumentId + "/" +
                this.helper.dateFormat(fDate, this.defaultHisoryDateFormat, false) + "/" +
                this.helper.dateFormat(tDate, this.defaultHisoryDateFormat, false);
            if (!this.globalVars.generalSettings.currency.isDefault)
                params += "/" + this.globalVars.generalSettings.currency.value;
            
            this.http.get(this.servicesUrl + params)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        var data = res.json();
                        if (data.length > 0) {
                            if (storageData == null) {
                                storageData = { cacheTime: new Date().getTime() };
                            }
                            if (!isAppend) {
                                storageData[instrumentId] = data;
                                this.processData(data);
                            }
                            else {
                                storageData[instrumentId] = data.concat(storageData[instrumentId]);
                                var dataFilter = storageData[instrumentId].filter(cData => new Date(cData.Date) >= fDate && new Date(cData.Date) <= new Date());
                                if (dataFilter.length > 0) {
                                    this.processData(dataFilter);
                                }
                            }
                            this.storage.set(this.historyStorageKey, storageData);
                            this.resolve(this.chartData);
                        }
                        else
                            this.getHistoryDataFromStorage(instrumentId, storageData, fDate, tDate);
                    }
                    else {
                        this.getHistoryDataFromStorage(instrumentId, storageData, fDate, tDate);
                    }
                },
                error => {
                    console.log(error);
                    this.getHistoryDataFromStorage(instrumentId, storageData, fDate, tDate);
                }
                );
        }
        else
            this.getHistoryDataFromStorage(instrumentId, storageData, fDate, tDate);
    }

    getHistoryDataFromStorage(instrumentId, data, fDate, tDate) {
        if (data != null && data[instrumentId] && data[instrumentId].length > 0) {
            var dataFilter = data[instrumentId].filter(cData => new Date(cData.Date) >= fDate && new Date(cData.Date) <= tDate);
            if (dataFilter.length > 0) {
                this.processData(dataFilter);
            }
            this.resolve(this.chartData);
        }
        else {
            if (this.isPercentData)
                this.resolve([]);
            else
                this.resolve({ close: [], volume: [] });
        }
    }

    /*---------------------------INTRADAY---------------------------------*/
    getDailyData(instrumentId, isPercentData = false, pDate = null) {
        this.isPercentData = isPercentData;
        this.dailyStorageKey = this.apiName + "_" + this.dailyKey + "_" + this.globalVars.generalSettings.currency.value;
        this.storage.get(this.dailyStorageKey).then((sData) => {
            if (sData != null) {
                var storageData = sData;
                var TTL = this.globalVars.sharegraph.intradayStorageTTL;
                if (TTL <= (new Date().getTime() - storageData.cacheTime)) {
                    this.getDailyDataFromServices(instrumentId, null, pDate);
                }
                else {
                    //Case: Tiến
                    if (pDate != null) {
                        this.getDailyDataFromServices(instrumentId, null, pDate);
                    }
                    else {
                        if (storageData[instrumentId] != undefined && storageData[instrumentId] != null && storageData[instrumentId].length > 0) {
                            var schartData = storageData[instrumentId];
                            var sDate = schartData[schartData.length - 1].Date.split("T");
                            var dDate = sDate[0].split("-");
                            var dTime = sDate[1].split(":");
                            var sMaxDate = new Date(dDate[0], dDate[1] - 1, dDate[2], dTime[0], dTime[1]);
                            this.getDailyDataFromServices(instrumentId, storageData, sMaxDate, true);
                        }
                        else
                            this.getDailyDataFromServices(instrumentId, storageData);
                    }
                }
            }
            else {
                this.getDailyDataFromServices(instrumentId, null, pDate);
            }
        });
    }

    getDailyDataFromServices(instrumentId, currentStorageData, fDate = null, isAppend = false) {
        let storageData = currentStorageData;
        if (this.globalVars.isOnline) {
            var sDate = "";
            var params = instrumentId;
            if (fDate != null) {
                if (fDate.toString().indexOf("T000000") > 0)
                    sDate = fDate;
                else {
                    sDate = this.helper.dateFormat(fDate, this.defaultDailyDateFormat, false);
                    sDate = sDate.replace(" ", "T") + "/";
                }
                params += "/" + sDate;
            }
            if (!this.globalVars.generalSettings.currency.isDefault)
                params += "/" + this.globalVars.generalSettings.currency.value;

            this.http.get(this.servicesUrl + "1d/" + params)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        var data = res.json();
                        if (data.length > 0) {
                            if (storageData == null) {
                                storageData = { cacheTime: new Date().getTime() };
                            }
                            if (!isAppend) {
                                storageData[instrumentId] = data;
                                this.processData(data);
                            }
                            else {
                                var sDate = new Date(storageData[instrumentId][0].Date).toDateString();
                                var nDate = new Date(data[0].Date).toDateString();
                                if (sDate == nDate)
                                    storageData[instrumentId] = storageData[instrumentId].concat(data);
                                else
                                    storageData[instrumentId] = data;
                                this.processData(storageData[instrumentId]);
                            }
                            this.storage.set(this.dailyStorageKey, storageData);
                            this.resolve(this.chartData);
                        }
                        else {
                            this.getDailyDataFromStorage(instrumentId, storageData);
                        }
                    }
                    else {
                        this.getDailyDataFromStorage(instrumentId, storageData);
                    }
                },
                error => {
                    console.log(error);
                    this.getDailyDataFromStorage(instrumentId, storageData);
                }
                );
        }
        else
            this.getDailyDataFromStorage(instrumentId, storageData);
    }

    getDailyDataFromStorage(instrumentId, data) {
        if (data != null && data[instrumentId] && data[instrumentId].length > 0) {
            this.processData(data[instrumentId]);
            this.resolve(this.chartData);
        }
        else {
            if (this.isPercentData)
                this.resolve([]);
            else
                this.resolve({ close: [], volume: [] });
        }
    }

    getFromDate(period) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(today.setMonth(today.getMonth() - period));
    }

    processData(data, isMultiple = false) {
        if (this.isPercentData) {
            var firstPrice = parseFloat(data[0].Close);
            this.chartData = [];
            if (!isMultiple) {
                data.forEach((obj, index) => {
                    var date = new Date(obj.Date).getTime();
                    var changePercent = index == 0 ? 0 : 100 * (parseFloat(obj.Close) - firstPrice) / firstPrice;
                    this.chartData.push([date, changePercent]);
                });
            }
            else {
                let multiData = {};
                data.forEach((instrument) => {
                    multiData[instrument.InstrumentId] = [];
                    if (instrument.Data.length > 0) {
                        firstPrice = parseFloat(instrument.Data[0].Close);
                        instrument.Data.forEach((obj, index) => {
                            var date = new Date(obj.Date).getTime();
                            var changePercent = index == 0 ? 0 : 100 * (parseFloat(obj.Close) - firstPrice) / firstPrice;
                            multiData[instrument.InstrumentId].push([date, changePercent]);
                        });
                    }
                });
                this.chartData = multiData;
            }
        }
        else {
            this.chartData = { close: [], volume: [] };
            data.forEach((obj) => {
                var date = new Date(obj.Date).getTime();
                this.chartData.close.push([date, parseFloat(obj.Close)]);
                this.chartData.volume.push([date, parseFloat(obj.Volume)]);
            });
        }
    }

    /*Compare Tabs*/
    getMultiChartData(iDs, period) {
        let params = iDs + "/";
        if (period != 1) {
            let fDate = this.getFromDate(period);
            let tDate = new Date();
            params += this.helper.dateFormat(fDate, this.defaultHisoryDateFormat, false) + "/" + this.helper.dateFormat(tDate, this.defaultHisoryDateFormat, false);
        }
        else {
            params = "1d/" + params;
        }
        this.isPercentData = true;
        return new Promise(resolve => {
            this.http.get(this.servicesUrl + params)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(
                res => {
                    if (res != undefined && res != null) {
                        var data = res.json();
                        this.processData(data, true);
                        resolve(this.chartData);
                    }
                    else {
                        resolve(null);
                    }
                },
                error => {
                    console.log(error);
                    resolve(null);
                }
                );
        });
        //http://server/myirappapi2/api/v1/chartdata/32940,70003,71957,100980,64348,68676/20160805/20160902/
        //http://server/myirappapi2/api/v1/chartdata/1d/32940,70003,71957,100980,64348/
    }
    /*End Compare Tabs*/
}