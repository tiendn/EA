import { Component, ViewChild } from '@angular/core';
import { NavParams, Content } from 'ionic-angular';
import { Helper } from '../../../../common/helper';
import { GlobalVars } from '../../../../common/global-vars';
import { ChartService } from '../../../../providers/chart-service';

declare var Highcharts: any;

@Component({
    selector: 'page-chart',
    templateUrl: 'charts.html',
    providers: [ChartService]
})
export class ChartsPage {

    @ViewChild(Content) content: Content;

    moduleName = "ShareGraph";
    ownShareTitle: string;
    type: number;
    watchListSharesTitle: string;
    watchListShare: any;
    listPeriod: any;
    tooltip: string;
    currentPeriod: number;
    ownShare: any;
    colors: Array<Object>;
    sharesChart: any;
    listOwnShares: any;
    priorityDay: any;
    currentPriorityId: number;
    chart: any;
    instrumentName: string;

    constructor(public navParams: NavParams, public helper: Helper, public globalVars: GlobalVars, public chartService: ChartService) {
        this.ownShareTitle = this.helper.getPhrase("OwnShares", this.moduleName);

        let lstPeriod = [
            {
                "Name": this.helper.getPhrase("Button1Day", this.moduleName),
                "Value": 1
            },
            {
                "Name": this.helper.getPhrase("Button3Month", this.moduleName),
                "Value": 3
            },
            {
                "Name": this.helper.getPhrase("Button6Month", this.moduleName),
                "Value": 6
            },
            {
                "Name": this.helper.getPhrase("Button1Year", this.moduleName),
                "Value": 12
            },
            {
                "Name": this.helper.getPhrase("Button3Year", this.moduleName),
                "Value": 36
            },
        ];
        let rootParams = this.navParams.data;
        if (rootParams.type == "watchlist") {
            this.type = 0;
            this.watchListSharesTitle = this.helper.getPhrase("WatchlistShares", this.moduleName);
        }
        else {
            this.type = 1;
            lstPeriod.splice(0, 1);
            this.watchListSharesTitle = this.helper.getPhrase("Indices", this.moduleName);
        }
        this.watchListShare = rootParams.compareData;
        this.listPeriod = lstPeriod;
        this.tooltip = this.helper.getPhrase("CompareNote", this.moduleName);
        // Set default Period = 3
        this.currentPeriod = 3;

        // ownshare mặc định được
        let currentOwnShareActive = rootParams.activeId ? rootParams.activeId : this.globalVars.configData.common.instruments[0].instrumentid;
        this.ownShare = [
            {
                "instrumentID": currentOwnShareActive,
                "priority": 1
            }
        ];
        // Mảng màu
        let colors = [];
        if (this.globalVars.configData.sharegraph.comparechartcolors && this.globalVars.configData.sharegraph.comparechartcolors.length > 0) {
            this.globalVars.configData.sharegraph.comparechartcolors.forEach((color) => {
                colors.push({
                    color: color,
                    isSelected: false
                });
            });
        }
        else {
            colors = [
                {
                    "color": "#FFFFFF",
                    "isSelected": false
                },
                {
                    "color": "#4A90E2",
                    "isSelected": false
                },
                {
                    "color": "#7ED321",
                    "isSelected": false
                },
                {
                    "color": "#FF7F0E",
                    "isSelected": false
                },
                {
                    "color": "#FF6275",
                    "isSelected": false
                }
            ];
        }
        this.colors = colors;
        // Danh sách các ownshare.
        let ownShares = [];
        this.globalVars.configData.common.instruments.forEach((item, index) => {
            item.priority = index + 1;
            ownShares.push(item);
            //set own share active when first load
            if (item.instrumentid == currentOwnShareActive) {
                this.sharesChart = [{
                    instrumentID: item.instrumentid,
                    shareName: item.ticker,
                    color: this.colors[0]["color"],
                    isOwnShare: true,
                    priority: item.priority
                }];
            }
        });
        this.listOwnShares = ownShares;
        this.priorityDay = null;
        this.currentPriorityId = currentOwnShareActive;
    }

    ionViewDidEnter() {
        //let lstBackdrop = document.getElementsByTagName("ion-backdrop");
        //while (lstBackdrop.length > 0) {
        //    lstBackdrop[0].parentElement.removeChild(lstBackdrop[0]);
        //}
    }

    // Get index of this instrumentID on sharesChart array object.
    getIndexShare(id) {
        for (let i = 0; i < this.sharesChart.length; i++)
            if (this.sharesChart[i].instrumentID == id)
                return i;
        return -1;
    }
    // Get color that not choosed in list
    getColor() {
        for (let i = 0; i < this.colors.length; i++)
            if (this.colors[i]["isSelected"] === false) {
                this.colors[i]["isSelected"] = true;
                return this.colors[i]["color"];
            }
        return undefined;
    }
    // Delete color from list
    deleteColor(color) {
        for (let i = 0; i < this.colors.length; i++)
            if (this.colors[i]["color"] === color) {
                this.colors[i]["isSelected"] = false;
                break;
            }
    }

    ionViewDidLoad() {
        let $scope = this;
        // Draw chart at first
        this.chart = new Highcharts.Chart({
            chart: {
                backgroundColor: '#484849',
                renderTo: 'charts',
                type: 'line',
            },
            title: {
                text: '',
            },
            tooltip: {
                valueDecimals: 2,
                valueSuffix: ' %',
                shared: true,
                hideDelay: 300,
                animation: false,
                positioner: function (labelWidth, labelHeight, point) {
                    var tooltipX, tooltipY;
                    if (point.plotX + labelWidth > $scope.chart.plotWidth) {
                        tooltipX = point.plotX + $scope.chart.plotLeft - labelWidth - 20;
                    } else {
                        tooltipX = point.plotX + $scope.chart.plotLeft + 20;
                    }
                    tooltipY = point.plotY + $scope.chart.plotTop - 50;
                    return {
                        x: tooltipX,
                        y: tooltipY
                    };
                }
            },
            xAxis: {
                gridLineWidth: 1,
                // Get width tickInterval
                tickInterval: (this.currentPeriod / 3) * 30 * 24 * 60 * 60 * 1000,
                type: 'datetime',
                tickLength: 0,
                gridLineColor: '#848484',
                lineColor: '#484849',
                lineWidth: 1,
                dateTimeLabelFormats: {
                    day: "%A, %b %e, %Y",
                    month: '%b\' %e',
                    year: "%Y"
                },
                labels: {
                    style: {
                        color: '#808080',
                        fontSize: '10px'
                    }
                }
            },
            yAxis: {
                title: '',
                gridLineWidth: 0,
                opposite: true,
                labels: {
                    formatter: function () {
                        return this.value + ' %';
                    },
                    style: {
                        color: '#808080',
                        fontSize: '10px'
                    }
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            marker: {
                enabled: false,

            },

            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            }
        });
        // If this device is Ipad, change label font-size
        if (this.globalVars.isTablet) {
            this.chart.xAxis[0].update({
                labels: {
                    style: {
                        color: '#808080',
                        fontSize: '15px'
                    }
                }
            });
            this.chart.yAxis[0].update({
                labels: {
                    style: {
                        color: '#808080',
                        fontSize: '15px'
                    }
                }
            });
        }
        // Add data at first time with 3D period
        this.chartService.getChartData(this.sharesChart[0].instrumentID, this.currentPeriod, true).then(data => {
            this.colors[0]["isSelected"] = true;
            if (data instanceof Array && data.length > 0) {
                // add Series
                this.addChartSeries(this.sharesChart[0].instrumentID, this.sharesChart[0].shareName, data, this.sharesChart[0].color);
            }
            else {
                // console.log("This day have no data");
            }
        });
    }

    loadChartData() {
        this.priorityDay = null;
        // console.log(this.colors);
        if (this.sharesChart.length > 1) { //Multiple Ids
            let iDs = [];
            let shares = this.sharesChart.slice();
            shares.sort(function (a, b) {
                return a.priority - b.priority;
            });
            shares.forEach((obj) => {
                iDs.push(obj.instrumentID);
            });
            this.chartService.getMultiChartData(iDs.toString(), this.currentPeriod).then(data => {
                if (data != null) {
                    let keys = Object.keys(data);
                    if (this.currentPeriod == 1)
                        this.priorityDay = this.getPriorityDay(data[keys[0]][0][0]); //get date of first item
                    keys.forEach((key) => {
                        this.updateSeriesData(parseFloat(key), data[key]);
                    });
                }
                this.updateTickInterval();
                this.helper.hideLoading(this);
            });
        }
        else {
            this.chartService.getChartData(this.sharesChart[0].instrumentID, this.currentPeriod, true).then(data => {
                if (data instanceof Array && data.length > 0) {
                    if (this.currentPeriod == 1)
                        this.priorityDay = this.getPriorityDay(data[0][0]); //get date of first item
                    this.updateSeriesData(this.sharesChart[0].instrumentID, data);
                }
                this.updateTickInterval();
                this.helper.hideLoading(this);
            });
        }
    }

    //   Update
    changePeriod(period) {
        if (period != this.currentPeriod) {
            this.chart.tooltip.hide();
            this.helper.showLoading(this);
            // Assign currentPeriod
            this.currentPeriod = period;
            this.loadChartData();
        }
    }

    // Add a share on chart.
    selectedId(sharesData, isOwnShare) {
        //if(!this.onProgress){
        //this.onProgress = true;
        // If this instrumentID isn't on list shares

        let id = "";
        let name = "";
        let priority = 10;
        if (isOwnShare) { //Own shares
            id = sharesData.instrumentid;
            name = sharesData.ticker;
            priority = sharesData.priority;
        }
        else {//Watchlist
            id = sharesData.Id;
            name = sharesData.Ticker;
        }
        if (this.getIndexShare(id) < 0) { //Add new
            if (this.sharesChart.length < 5) { // If the number of Shares < 5

                this.helper.showLoading(this);

                // Get color
                let color = this.getColor();
                // Push attr on sharesChart arr object.
                this.sharesChart.push({ instrumentID: id, shareName: name, color: color, isOwnShare: isOwnShare, priority: priority });

                let priorityId = this.getCurrentPriorityId();
                // if this share is ownshare , sort this.ownShare arr obj by priority attr
                if (isOwnShare) {
                    this.ownShare.push({ instrumentID: id, priority: priority });
                    this.ownShare.sort(function (a, b) {
                        return a.priority - b.priority;
                    });
                }
                if (this.currentPriorityId != priorityId) {
                    this.currentPriorityId = priorityId;
                    this.instrumentName = name;
                    this.loadChartData();
                }
                else {
                    this.chartService.getChartData(id, this.currentPeriod, true, this.priorityDay).then(data => {
                        if (data instanceof Array && data.length > 0) {
                            this.addChartSeries(id, name, data, color);
                        }
                        this.helper.hideLoading(this);
                    });
                }

            }
            else { // the number of share > 5
                console.log("Full choose");
            }
        }
        else {
            if (this.ownShare.length > 1) { // If this share is on list, erase
                // This color is not selected.
                this.deleteColor(this.sharesChart[this.getIndexShare(id)].color);
                // Erase line have this instrumentID
                if (this.chart.get(id) !== null) {
                    this.chart.get(id).remove();
                }
                let isOwnShare = this.sharesChart[this.getIndexShare(id)].isOwnShare;
                this.sharesChart = this.sharesChart.filter(function (el) {
                    return el.instrumentID !== id;
                });
                let priorityId = this.getCurrentPriorityId();
                if (isOwnShare) {
                    this.ownShare = this.ownShare.filter(function (el) {
                        return el.instrumentID != id;
                    });
                    if (this.currentPriorityId != priorityId) {
                        this.currentPriorityId = priorityId;
                        this.loadChartData();
                    }
                }
            }
            else if (this.ownShare.length <= 1 && !isOwnShare) { // If the number of ownshare <=1
                // This color is not selected.
                this.deleteColor(this.sharesChart[this.getIndexShare(id)].color);
                // Filter
                this.sharesChart = this.sharesChart.filter(function (el) {
                    return el.instrumentID !== id;
                });
                // Erase line have this instrumentID
                if (this.chart.get(id) !== null) // Nếu id đó có trong đồ thị
                    this.chart.get(id).remove();
            }
        } // End number of ownshare > 1 case
    }     // End getData.

    removeChartSeries() {
        let seriesLength = this.chart.series.length;
        for (let i = 0; i < seriesLength; i++) {
            this.chart.series[0].remove();
        }

    }
    addChartSeries(id, name, data, color) {
        let marker = true;
        if (data.length > 3) marker = false;
        this.chart.addSeries({
            id: id,
            name: name,
            data: data,
            color: color,
            lineWidth: 1,
            marker: {
                symbol: 'circle',
                radius: 1
            }
        }, true);
    }

    updateTickInterval() {
        this.chart.xAxis[0].update({
            tickInterval: this.currentPeriod == 1 ? undefined : (this.currentPeriod / 3) * 30 * 24 * 60 * 60 * 1000,
        });
    }

    updateSeriesData(id, data) {
        let series = this.chart.get(id);
        if (series != undefined && series != null) {
            series.setData([]);
            if (data.length > 0)
                series.setData(data);
            else {
                this.deleteColor(this.sharesChart[this.getIndexShare(id)].color);
                // Erase line have this instrumentID
                if (this.chart.get(id) !== null) // Nếu id đó có trong đồ thị
                    this.chart.get(id).remove();
            }
        }
        else if (data.length > 0) {
            let serie = this.sharesChart.filter(obj => obj.instrumentID == id);
            if (serie.length > 0)
                this.addChartSeries(id, serie[0].shareName, data, serie[0].color);
        }
    }

    getPriorityDay(date) {
        return this.helper.dateFormat(new Date(date), "yyyymmdd") + "T000000";
    }

    getCurrentPriorityId() {
        let shares = this.sharesChart.slice();
        shares.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return shares[0].instrumentID;
    }
}
