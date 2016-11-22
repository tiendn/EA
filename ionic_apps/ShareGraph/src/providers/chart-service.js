"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
require('rxjs/Rx');
var ChartService = (function () {
    function ChartService(http, storage, globalVars, helper) {
        this.http = http;
        this.storage = storage;
        this.globalVars = globalVars;
        this.helper = helper;
        this.apiName = "chartdata";
        this.defaultHisoryDateFormat = "yyyymmdd";
        this.defaultDailyDateFormat = "yyyymmdd HHMMss";
        this.historyKey = "history";
        this.dailyKey = "daily";
        //this.servicesUrl = this.globalVars.servicesUrl + this.apiName + "/";
    }
    ChartService.prototype.getChartData = function (instrumentId, period, isPercentData, fDate) {
        var _this = this;
        if (isPercentData === void 0) { isPercentData = false; }
        if (fDate === void 0) { fDate = null; }
        return new Promise(function (resolve) {
            _this.resolve = resolve;
            _this.servicesUrl = _this.globalVars.servicesUrl + _this.apiName + "/";
            if (period == 1)
                _this.getDailyData(instrumentId, isPercentData, fDate);
            else
                _this.getHistoryData(instrumentId, period, isPercentData);
        });
    };
    /*---------------------------HISTORY---------------------------------*/
    ChartService.prototype.getHistoryData = function (instrumentId, period, isPercentData) {
        var _this = this;
        if (isPercentData === void 0) { isPercentData = false; }
        this.isPercentData = isPercentData;
        this.historyStorageKey = this.apiName + "_" + this.historyKey + "_" + this.globalVars.generalSettings.currency.value;
        this.storage.get(this.historyStorageKey).then(function (sData) {
            var fDate = _this.getFromDate(period);
            var tDate = new Date();
            if (sData != null) {
                var storageData = sData;
                var TTL = _this.globalVars.sharegraph.historyStorageTTL;
                if (TTL <= (new Date().getTime() - storageData.cacheTime)) {
                    _this.getHistoryDataFromServices(instrumentId, fDate, tDate, null);
                }
                else {
                    if (storageData[instrumentId] != undefined && storageData[instrumentId] != null && storageData[instrumentId].length > 0) {
                        var schartData = storageData[instrumentId];
                        var sminDate = new Date(new Date(schartData[0].Date).setHours(0, 0, 0, 0));
                        if (fDate < sminDate) {
                            _this.getHistoryDataFromServices(instrumentId, fDate, sminDate, storageData, true);
                        }
                        else {
                            var chartDataFilter = schartData.filter(function (cData) { return new Date(cData.Date) >= fDate; });
                            if (chartDataFilter.length > 0) {
                                _this.processData(chartDataFilter);
                                _this.resolve(_this.chartData);
                            }
                        }
                    }
                    else
                        _this.getHistoryDataFromServices(instrumentId, fDate, tDate, storageData);
                }
            }
            else {
                _this.getHistoryDataFromServices(instrumentId, fDate, tDate, null);
            }
        });
    };
    ChartService.prototype.getHistoryDataFromServices = function (instrumentId, fDate, tDate, currentStorageData, isAppend) {
        var _this = this;
        if (isAppend === void 0) { isAppend = false; }
        var storageData = currentStorageData;
        if (this.globalVars.isOnline) {
            var params = instrumentId + "/" +
                this.helper.dateFormat(fDate, this.defaultHisoryDateFormat, false) + "/" +
                this.helper.dateFormat(tDate, this.defaultHisoryDateFormat, false);
            if (!this.globalVars.generalSettings.currency.isDefault)
                params += "/" + this.globalVars.generalSettings.currency.value;
            this.http.get(this.servicesUrl + params)
                .timeout(this.globalVars.requestTimeout)
                .retry(this.globalVars.retry)
                .subscribe(function (res) {
                if (res != undefined && res != null) {
                    var data = res.json();
                    if (data.length > 0) {
                        if (storageData == null) {
                            storageData = { cacheTime: new Date().getTime() };
                        }
                        if (!isAppend) {
                            storageData[instrumentId] = data;
                            _this.processData(data);
                        }
                        else {
                            storageData[instrumentId] = data.concat(storageData[instrumentId]);
                            var dataFilter = storageData[instrumentId].filter(function (cData) { return new Date(cData.Date) >= fDate && new Date(cData.Date) <= new Date(); });
                            if (dataFilter.length > 0) {
                                _this.processData(dataFilter);
                            }
                        }
                        _this.storage.set(_this.historyStorageKey, storageData);
                        _this.resolve(_this.chartData);
                    }
                    else
                        _this.getHistoryDataFromStorage(instrumentId, storageData, fDate, tDate);
                }
                else {
                    _this.getHistoryDataFromStorage(instrumentId, storageData, fDate, tDate);
                }
            }, function (error) {
                console.log(error);
                _this.getHistoryDataFromStorage(instrumentId, storageData, fDate, tDate);
            });
        }
        else
            this.getHistoryDataFromStorage(instrumentId, storageData, fDate, tDate);
    };
    ChartService.prototype.getHistoryDataFromStorage = function (instrumentId, data, fDate, tDate) {
        if (data != null && data[instrumentId] && data[instrumentId].length > 0) {
            var dataFilter = data[instrumentId].filter(function (cData) { return new Date(cData.Date) >= fDate && new Date(cData.Date) <= tDate; });
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
    };
    /*---------------------------INTRADAY---------------------------------*/
    ChartService.prototype.getDailyData = function (instrumentId, isPercentData, pDate) {
        var _this = this;
        if (isPercentData === void 0) { isPercentData = false; }
        if (pDate === void 0) { pDate = null; }
        this.isPercentData = isPercentData;
        this.dailyStorageKey = this.apiName + "_" + this.dailyKey + "_" + this.globalVars.generalSettings.currency.value;
        this.storage.get(this.dailyStorageKey).then(function (sData) {
            if (sData != null) {
                var storageData = sData;
                var TTL = _this.globalVars.sharegraph.intradayStorageTTL;
                if (TTL <= (new Date().getTime() - storageData.cacheTime)) {
                    _this.getDailyDataFromServices(instrumentId, null, pDate);
                }
                else {
                    //Case: Tiến
                    if (pDate != null) {
                        _this.getDailyDataFromServices(instrumentId, null, pDate);
                    }
                    else {
                        if (storageData[instrumentId] != undefined && storageData[instrumentId] != null && storageData[instrumentId].length > 0) {
                            var schartData = storageData[instrumentId];
                            var sDate = schartData[schartData.length - 1].Date.split("T");
                            var dDate = sDate[0].split("-");
                            var dTime = sDate[1].split(":");
                            var sMaxDate = new Date(dDate[0], dDate[1] - 1, dDate[2], dTime[0], dTime[1]);
                            _this.getDailyDataFromServices(instrumentId, storageData, sMaxDate, true);
                        }
                        else
                            _this.getDailyDataFromServices(instrumentId, storageData);
                    }
                }
            }
            else {
                _this.getDailyDataFromServices(instrumentId, null, pDate);
            }
        });
    };
    ChartService.prototype.getDailyDataFromServices = function (instrumentId, currentStorageData, fDate, isAppend) {
        var _this = this;
        if (fDate === void 0) { fDate = null; }
        if (isAppend === void 0) { isAppend = false; }
        var storageData = currentStorageData;
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
                .subscribe(function (res) {
                if (res != undefined && res != null) {
                    var data = res.json();
                    if (data.length > 0) {
                        if (storageData == null) {
                            storageData = { cacheTime: new Date().getTime() };
                        }
                        if (!isAppend) {
                            storageData[instrumentId] = data;
                            _this.processData(data);
                        }
                        else {
                            var sDate = new Date(storageData[instrumentId][0].Date).toDateString();
                            var nDate = new Date(data[0].Date).toDateString();
                            if (sDate == nDate)
                                storageData[instrumentId] = storageData[instrumentId].concat(data);
                            else
                                storageData[instrumentId] = data;
                            _this.processData(storageData[instrumentId]);
                        }
                        _this.storage.set(_this.dailyStorageKey, storageData);
                        _this.resolve(_this.chartData);
                    }
                    else {
                        _this.getDailyDataFromStorage(instrumentId, storageData);
                    }
                }
                else {
                    _this.getDailyDataFromStorage(instrumentId, storageData);
                }
            }, function (error) {
                console.log(error);
                _this.getDailyDataFromStorage(instrumentId, storageData);
            });
        }
        else
            this.getDailyDataFromStorage(instrumentId, storageData);
    };
    ChartService.prototype.getDailyDataFromStorage = function (instrumentId, data) {
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
    };
    ChartService.prototype.getFromDate = function (period) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(today.setMonth(today.getMonth() - period));
    };
    ChartService.prototype.processData = function (data, isMultiple) {
        var _this = this;
        if (isMultiple === void 0) { isMultiple = false; }
        if (this.isPercentData) {
            var firstPrice = parseFloat(data[0].Close);
            this.chartData = [];
            if (!isMultiple) {
                data.forEach(function (obj, index) {
                    var date = new Date(obj.Date).getTime();
                    var changePercent = index == 0 ? 0 : 100 * (parseFloat(obj.Close) - firstPrice) / firstPrice;
                    _this.chartData.push([date, changePercent]);
                });
            }
            else {
                var multiData_1 = {};
                data.forEach(function (instrument) {
                    multiData_1[instrument.InstrumentId] = [];
                    if (instrument.Data.length > 0) {
                        firstPrice = parseFloat(instrument.Data[0].Close);
                        instrument.Data.forEach(function (obj, index) {
                            var date = new Date(obj.Date).getTime();
                            var changePercent = index == 0 ? 0 : 100 * (parseFloat(obj.Close) - firstPrice) / firstPrice;
                            multiData_1[instrument.InstrumentId].push([date, changePercent]);
                        });
                    }
                });
                this.chartData = multiData_1;
            }
        }
        else {
            this.chartData = { close: [], volume: [] };
            data.forEach(function (obj) {
                var date = new Date(obj.Date).getTime();
                _this.chartData.close.push([date, parseFloat(obj.Close)]);
                _this.chartData.volume.push([date, parseFloat(obj.Volume)]);
            });
        }
    };
    /*Compare Tabs*/
    ChartService.prototype.getMultiChartData = function (iDs, period) {
        var _this = this;
        var params = iDs + "/";
        if (period != 1) {
            var fDate = this.getFromDate(period);
            var tDate = new Date();
            params += this.helper.dateFormat(fDate, this.defaultHisoryDateFormat, false) + "/" + this.helper.dateFormat(tDate, this.defaultHisoryDateFormat, false);
        }
        else {
            params = "1d/" + params;
        }
        this.isPercentData = true;
        return new Promise(function (resolve) {
            _this.http.get(_this.servicesUrl + params)
                .timeout(_this.globalVars.requestTimeout)
                .retry(_this.globalVars.retry)
                .subscribe(function (res) {
                if (res != undefined && res != null) {
                    var data = res.json();
                    _this.processData(data, true);
                    resolve(_this.chartData);
                }
                else {
                    resolve(null);
                }
            }, function (error) {
                console.log(error);
                resolve(null);
            });
        });
        //http://server/myirappapi2/api/v1/chartdata/32940,70003,71957,100980,64348,68676/20160805/20160902/
        //http://server/myirappapi2/api/v1/chartdata/1d/32940,70003,71957,100980,64348/
    };
    ChartService = __decorate([
        core_1.Injectable()
    ], ChartService);
    return ChartService;
}());
exports.ChartService = ChartService;
