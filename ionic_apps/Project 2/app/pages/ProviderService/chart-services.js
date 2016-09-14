import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage, LocalStorage} from 'ionic-angular';
import {Helper} from './helper';

@Injectable()
export class ChartServices {
    static get parameters(){
        return [[Http],[Helper]];
    }

    constructor(http,helper) {
        this.http = http;
        this.localStorage = new Storage(LocalStorage);
        this.helper = helper;
        this.apiName = "chartdata";
        this.servicesUrl = "http://10.10.15.8/myirappapi2/api/v1/" + this.apiName + "/";
        this.httpRequestHeader = {
            headers: {
                'Authorization': "Basic bm9ybWFsdXNlcjpwNmVqYVByRQ=="
            }
        };
        this.defaultHisoryDateFormat = "yyyymmdd";
        this.defaultDailyDateFormat = "yyyymmdd HHMMss";
        this.storageData = null;
        this.historyKey = "history";
        this.dailyKey = "daily";
    }

    /*---------------------------HISTORY---------------------------------*/
    getHistoryData(instrumentId, period, isPercentData = false){
        let $scope = this;
        this.isPercentData = isPercentData;
        this.historyStorageKey = this.apiName + "_" + this.historyKey;
        return new Promise(resolve => {
            this.localStorage.get(this.historyStorageKey).then(function(sData){
                var fDate = $scope.getFromDate(period);
                var tDate = new Date();
                if(sData != null){
                    var storageData = JSON.parse(sData);
                    var TTL = 300000;
                    if(TTL <= (new Date().getTime() - storageData.cacheTime)){
                        $scope.getHistoryDataFromServices(resolve, instrumentId, fDate, tDate, null);
                    }
                    else{
                        if(storageData[instrumentId] != undefined && storageData[instrumentId] != null && storageData[instrumentId].length > 0){
                            var schartData = storageData[instrumentId];
                            var sminDate = new Date(new Date(schartData[0].Date).setHours(0, 0, 0, 0));
                            if(fDate < sminDate){
                                $scope.getHistoryDataFromServices(resolve, instrumentId, fDate, sminDate, storageData, true);
                            }
                            else{
                                var chartDataFilter = schartData.filter(cData => new Date(cData.Date) >= fDate);
                                if(chartDataFilter.length > 0){
                                    $scope.processData(chartDataFilter);
                                    resolve($scope.chartData);
                                }
                            }
                        }
                        else
                            $scope.getHistoryDataFromServices(resolve, instrumentId, fDate, tDate, storageData);
                    }
                }
                else{
                    $scope.getHistoryDataFromServices(resolve, instrumentId, fDate, tDate, null);
                }
            });
        });
    }

    getHistoryDataFromServices(resolve, instrumentId, fDate, tDate, currentStorageData, isAppend = false){
        let storageData = currentStorageData;
        //if(irApp.isOnline){
            let $scope = this;
            var params = instrumentId + "/" +
                        $scope.helper.dateFormat(fDate, $scope.defaultHisoryDateFormat) + "/" +
                        $scope.helper.dateFormat(tDate, $scope.defaultHisoryDateFormat); //+ "/" + irApp.companyCode;
            this.http.get(this.servicesUrl + params, this.httpRequestHeader)
            // this.http.get('./charts.json')
                // .timeout(irApp.defaultSettings.common.requestTimeout)
                // .retry(irApp.defaultSettings.common.retry)
                .subscribe(
                    res => {
                        if(res != undefined && res != null){
                            var data = res.json();
                            if(data.length > 0){
                        
                                if(storageData == null){
                                    storageData = {cacheTime: new Date().getTime()};
                                }
                                if(!isAppend){
                                    storageData[instrumentId] = data;
                                    $scope.processData(data);
                                }
                                else{
                                    storageData[instrumentId] = data.concat(storageData[instrumentId]);
                                    var dataFilter = storageData[instrumentId].filter(cData => new Date(cData.Date) >= fDate && new Date(cData.Date) <= new Date());
                                    if(dataFilter.length > 0){
                                        $scope.processData(dataFilter);
                                    }
                                }
                                this.localStorage.set(this.historyStorageKey, JSON.stringify(storageData));
                                resolve($scope.chartData);
                            }
                            else
                                $scope.getHistoryDataFromStorage(resolve, instrumentId, storageData, fDate, tDate);
                        }
                        else{
                            $scope.getHistoryDataFromStorage(resolve, instrumentId, storageData, fDate, tDate);
                        }
                    },
                    error => {
                        console.log(error);
                        $scope.getHistoryDataFromStorage(resolve, instrumentId, storageData, fDate, tDate);
                    }
            );
        //}
        //else
        //    $scope.getHistoryDataFromStorage(resolve, instrumentId, storageData, fDate, tDate);
    }

    getHistoryDataFromStorage(resolve, instrumentId, data, fDate, tDate){
        if(data != null && data[instrumentId] && data[instrumentId].length > 0){
            var dataFilter = data[instrumentId].filter(cData => new Date(cData.Date) >= fDate && new Date(cData.Date) <= tDate);
            if(dataFilter.length > 0){
                $scope.processData(dataFilter);
            }
            resolve(this.chartData);
        }
        else{
            if(this.isPercentData)
                resolve([]);
            else
                resolve({close:[],volume:[]});
        }
    }

    /*---------------------------INTRADAY---------------------------------*/
    getDailyData(instrumentId, isPercentData = false){
        // alert(1);
        this.isPercentData = isPercentData;
        let $scope = this;
        this.dailyStorageKey = this.apiName + "_" + this.dailyKey;
        return new Promise(resolve => {

            let $scope = this;
            //var sDate = "";

            var fDate = new Date(new Date().setHours(0,0,0,0));
            fDate = $scope.helper.dateFormat(fDate, $scope.defaultDailyDateFormat);
            fDate = fDate.replace(" ", "T") + "/";

            // if(fDate != null){
            //     // console.log(fDate);
            //     sDate = $scope.helper.dateFormat(fDate, $scope.defaultDailyDateFormat);
            //     // console.log(sDate);
            //     sDate = sDate.replace(" ", "T") + "/";
            // }
            var params = instrumentId + "/" + fDate;
            // console.log(this.servicesUrl + params);
            // if (!irApp.appSettingsData.currency.isDefault)
                // params += "/" + irApp.appSettingsData.currency.value;
            // console.log(this.servicesUrl + params);    
            this.http.get(this.servicesUrl + params, this.httpRequestHeader)
            // console.log("http://10.10.15.8/myirappapi2/api/v1/chartdata/"+instrumentId+"/20160912T000000");
            // this.http.get("http://10.10.15.8/myirappapi2/api/v1/chartdata/"+instrumentId+"/20160912T000000", this.httpRequestHeader)
            // this.http.get('./charts.json')
                // .timeout(irApp.defaultSettings.common.requestTimeout)
                // .retry(irApp.defaultSettings.common.retry)
                .subscribe(
                    res => {
                        if(res != undefined && res != null){
                            var data = res.json();
                            
                            if(data.length > 0){
                                // if(storageData == null){
                                //     storageData = {cacheTime: new Date().getTime()};
                                // }
                                // if(!isAppend){
                                //     storageData[instrumentId] = data;
                                    $scope.processData(data);
                                // }
                                // else{
                                //     var sDate = new Date(storageData[instrumentId][0].Date).toDateString();
                                //     var nDate = new Date(data[0].Date).toDateString();
                                //     if(sDate == nDate)
                                //         storageData[instrumentId] = storageData[instrumentId].concat(data);
                                //     else
                                //         storageData[instrumentId] = data;
                                //     $scope.processData(storageData[instrumentId]);
                                // }
                                // $scope.localStorage.set(this.dailyStorageKey, JSON.stringify(storageData));
                                resolve($scope.chartData);
                            }
                            else{
                                resolve([]);
                            }
                        }
                        else{
                            resolve([]);
                        }
                    },
                    error => {
                        console.log(error);
                        resolve([]);
                    }
            );


            // this.localStorage.get(this.dailyStorageKey).then(function(sData){
            //     var fDate = new Date(new Date().setHours(0,0,0,0));
            //     if(sData != null){
            //         var storageData = JSON.parse(sData);
            //         var TTL = 60000;
            //         if(TTL <= (new Date().getTime() - storageData.cacheTime)){
            //             $scope.getDailyDataFromServices(resolve, instrumentId, fDate, null);
            //         }
            //         else{
            //             if(storageData[instrumentId] != undefined && storageData[instrumentId] != null && storageData[instrumentId].length > 0){
            //                 var schartData = storageData[instrumentId];
            //                 var sDate = schartData[schartData.length - 1].Date.split("T");
            //                 var dDate = sDate[0].split("-");
            //                 var dTime = sDate[1].split(":");
            //                 var sMaxDate = new Date(dDate[0], dDate[1] - 1, dDate[2], dTime[0], dTime[1]);
            //                 $scope.getDailyDataFromServices(resolve, instrumentId, sMaxDate, storageData, true);
            //             }
            //             else
            //                 $scope.getDailyDataFromServices(resolve, instrumentId, fDate, storageData);
            //         }
            //     }
            //     else{
            //         $scope.getDailyDataFromServices(resolve, instrumentId, fDate, null);
            //     }
            // });
        });
    }

    getDailyDataFromServices(resolve, instrumentId, fDate = null, currentStorageData, isAppend = false){
        let storageData = currentStorageData;
        // if(irApp.isOnline){
            let $scope = this;
            var sDate = "";
            if(fDate != null){
                // console.log(fDate);
                sDate = $scope.helper.dateFormat(fDate, $scope.defaultDailyDateFormat);
                // console.log(sDate);
                sDate = sDate.replace(" ", "T") + "/";
            }
            var params = instrumentId + "/" + sDate;
            // console.log(this.servicesUrl + params);
            // if (!irApp.appSettingsData.currency.isDefault)
                // params += "/" + irApp.appSettingsData.currency.value;
            this.http.get(this.servicesUrl + params, this.httpRequestHeader)
            // console.log(this.servicesUrl + params);
            // this.http.get("http://10.10.15.8/myirappapi2/api/v1/chartdata/"+instrumentId+"/20160911T000000", this.httpRequestHeader)
            
            // this.http.get('./charts.json')
                // .timeout(irApp.defaultSettings.common.requestTimeout)
                // .retry(irApp.defaultSettings.common.retry)
                .subscribe(
                    res => {
                        if(res != undefined && res != null){
                            var data = res.json();
                            
                            if(data.length > 0){
                                if(storageData == null){
                                    storageData = {cacheTime: new Date().getTime()};
                                }
                                if(!isAppend){
                                    storageData[instrumentId] = data;
                                    $scope.processData(data);
                                }
                                else{
                                    var sDate = new Date(storageData[instrumentId][0].Date).toDateString();
                                    var nDate = new Date(data[0].Date).toDateString();
                                    if(sDate == nDate)
                                        storageData[instrumentId] = storageData[instrumentId].concat(data);
                                    else
                                        storageData[instrumentId] = data;
                                    $scope.processData(storageData[instrumentId]);
                                }
                                $scope.localStorage.set(this.dailyStorageKey, JSON.stringify(storageData));
                                resolve($scope.chartData);
                            }
                            else{
                                $scope.getDailyDataFromStorage(resolve, instrumentId, storageData);
                            }
                        }
                        else{
                            $scope.getDailyDataFromStorage(resolve, instrumentId, storageData);
                        }
                    },
                    error => {
                        console.log(error);
                        $scope.getDailyDataFromStorage(resolve, instrumentId, storageData);
                    }
            );
        // }
        // else
            // $scope.getDailyDataFromStorage(resolve, instrumentId, storageData);
    }

    getDailyDataFromStorage(resolve, instrumentId, data){
        if(data != null && data[instrumentId] && data[instrumentId].length > 0){
            this.processData(data[instrumentId]);
            resolve(this.chartData);
        }
        else{
            if(this.isPercentData)
                resolve([]);
            else
                resolve({close:[],volume:[]});
        }
    }

    getFromDate(period) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(today.setMonth(today.getMonth() - period));
    }

    processData(data){
        let $scope = this;
        if(this.isPercentData){
            var firstPrice = parseFloat(data[0].Close);
            this.chartData = [];
            data.forEach(function(obj, index){
                var date = new Date(obj.Date).getTime();
                var changePercent = index == 0 ? 0 : 100 * (parseFloat(obj.Close) - firstPrice) / firstPrice;
                $scope.chartData.push([date, changePercent]);
            });
        }
        else{
            this.chartData = {close:[],volume:[]};
            data.forEach(function(obj){
                var date = new Date(obj.Date).getTime();
                $scope.chartData.close.push([date, parseFloat(obj.Close)]);
                $scope.chartData.volume.push([date, parseFloat(obj.Volume)]);
            });
        }
        // console.log($scope.chartData.length);
    }
}
