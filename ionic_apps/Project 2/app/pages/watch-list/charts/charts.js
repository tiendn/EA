
import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';
import { ChartServices} from '../../ProviderService/chart-services';
@Component({
    providers:[ChartServices],
    templateUrl: 'build/pages/watch-list/charts/charts.html',
})
export class ChartsPage {
  static get parameters() {
    return [
      [ViewController],
      [ChartServices],
      [NavParams]
    ];
  }
  constructor(viewCtrl,chartServices,NavParams) {
        this.viewCtrl = viewCtrl;
        this.navParam = NavParams;
        this.chartCtrl = chartServices;
        if (this.navParam.data === "Watchlist"){
            this.type = 0;
            this.listPeriod = [
                {
                    "Name" : '1D',
                    "Value" : 1
                },
                {
                    "Name" : '3M',
                    "Value" : 3
                },
                {
                    "Name" : '6M',
                    "Value" : 6
                },
                {
                    "Name" : '1Y',
                    "Value" : 12
                },
                {
                    "Name" : '3Y',
                    "Value" : 36
                },
            ];
            this.ownShareTitle = "OWN SHARES";
            this.watchListSharesTitle = "WATCHLIST SHARES";
        }
        else if (this.navParam.data === "Indices"){
            this.type = 1;
            this.listPeriod = [
                {
                    "Name" : '3M',
                    "Value" : 3
                },
                {
                    "Name" : '6M',
                    "Value" : 6
                },
                {
                    "Name" : '1Y',
                    "Value" : 12
                },
                {
                    "Name" : '3Y',
                    "Value" : 36
                },
            ];
            this.ownShareTitle = "OWN SHARES & INDEX";
            this.watchListSharesTitle = "INDICES";
        }
        this.tooltip = "Tap on the ticker codes below to compare them. We limit the charting to five tickers." ;
        
        this.currentID = 1;
        this.currentPeriod = 3;
        this.dateTimeArr = [];
        this.sharesChart = [
            {
                "instrumentID":32940,
                "shareName":'SHR1',
                "color" : 'white'
            }
        ];
        // console.log(this.sharesChart);
        this.listShare = [
            {
                "instrumentID" : 32940,
                "shareName" : 'SHR1',
                "color": 'white'
            },
            {
                "instrumentID" : 70003,
                "shareName" : 'TICR2',
                "color": 'blue'
            },
            {
                "instrumentID" : 71957,
                "shareName" : 'TICR3',
                "color": 'green'
            },
            {
                "instrumentID" : 100980,
                "shareName" : 'TICR4',
                "color": 'orange'
            },
            {
                "instrumentID" : 32864,
                "shareName" : 'TICR5',
                "color": 'yellow'
            },
            {
                "instrumentID" : 32865,
                "shareName" : 'TICR6',
                "color": 'red'
            }
        ]
    }
    dismiss(){
        this.viewCtrl.dismiss();
    }
    ionViewLoaded(){
        this.chart = new Highcharts.Chart({
            chart : {
                backgroundColor: '#484849',
                renderTo : 'charts',
                type     : 'line',
                events: {
                    redraw: function () {
                        var label = this.renderer.label('The chart was just redrawn', 100, 120)
                            .attr({
                                fill: Highcharts.getOptions().colors[0],
                                padding: 10,
                                r: 5,
                                zIndex: 8
                            })
                            .css({
                                color: '#FFFFFF'
                            })
                            .add();

                        setTimeout(function () {
                            label.fadeOut();
                        }, 1000);
                    }
                }
            },
            title: {
                text: '',
                style: {
                    color: 'white',
                    font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                }
            },
            xAxis: {
                gridLineWidth: 1,
                tickInterval: (this.currentPeriod / 3) * 30 * 24 * 60 * 60 * 1000,            
                type: 'datetime',
                tickLength: 0,
                gridLineColor: '#848484',
                lineColor: '#484849',
                lineWidth: 1,
                dateTimeLabelFormats: {
                    day:"%A, %b %e, %Y",
                    month: '%b\' %e',
                    year:"%Y"
                },
            },
            yAxis:{
                title : '',
                gridLineWidth: 0,
                opposite : true,
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    }
                }
            },
            marker: {
                enabled: false
            },
            legend:{
                enabled: false
            },
            credits: {
                enabled: false
            },
            
        });
        this.chartCtrl.getHistoryData(this.listShare[0].instrumentID,this.currentPeriod,true).then(data=>{
            this.chart.addSeries({   
                id : this.listShare[0].instrumentID,    
                name: this.listShare[0].shareName,              
                data: data,
                color: this.listShare[0].color
            }, true);
        });
    }
    loadHistoryChart(){
        this.chart = new Highcharts.Chart({
            chart : {
                backgroundColor: '#484849',
                renderTo : 'charts',
                type     : 'line',
            },
            title: {
                text: '',
                style: {
                    color: 'white',
                    font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                }
            },
            xAxis: {
                gridLineWidth: 1,
                tickInterval: (this.currentPeriod / 3) * 30 * 24 * 60 * 60 * 1000,            
                type: 'datetime',
                tickLength: 0,
                gridLineColor: '#848484',
                lineColor: '#484849',
                lineWidth: 1,
                dateTimeLabelFormats: {
                    month: '%b\' %e',
                    year:"%Y"
                },
            },
            yAxis:{
                title : '',
                gridLineWidth: 0,
                opposite : true,
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    }
                }
            },
            marker: {
                enabled: false
            },
            legend:{
                enabled: false
            },
            credits: {
                enabled: false
            },
            
        });
        for (let i = 0 ; i < this.sharesChart.length ; i++){
            this.chartCtrl.getHistoryData(this.sharesChart[i].instrumentID,this.currentPeriod,true).then(data=>{
                // console.log(data);
                this.chart.addSeries({   
                    id : this.listShare[i].instrumentID,    
                    name: this.listShare[i].shareName,              
                    data: data,
                    color: this.listShare[i].color
                }, true); 
            });
        }
    }
    loadDailyChart(){
        this.chart = new Highcharts.Chart({
            chart : {
                backgroundColor: '#484849',
                renderTo : 'charts',
                type     : 'line',
            },
            title: {
                text: '',
                style: {
                    color: 'white',
                    font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                }
            },
            xAxis: {
                gridLineWidth: 1,
                // tickInterval:  8 * 60 * 60 * 1000,            
                type: 'datetime',
                tickLength: 0,
                gridLineColor: '#848484',
                lineColor: '#484849',
                lineWidth: 1,
                dateTimeLabelFormats: {
                    day:"%H:%M"
                    
                }
            },
            yAxis:{
                title : '',
                gridLineWidth: 0,
                opposite : true,
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    }
                }
            },
            marker: {
                enabled: false
            },
            legend:{
                enabled: false
            },
            credits: {
                enabled: false
            },
            
        });
        for (let i = 0 ; i < this.sharesChart.length ; i++){
            this.chartCtrl.getDailyData(this.sharesChart[i].instrumentID,true).then(data=>{
                console.log(this.sharesChart[i].instrumentID);
                console.log(data.length);
                this.chart.addSeries({   
                    id : this.listShare[i].instrumentID,    
                    name: this.listShare[i].shareName,              
                    data: data,
                    color: this.listShare[i].color
                }, true);
            });
        }
    }

    //   Update 
    changePeriod(period){
        // Xét period hiện tại
        this.currentPeriod = period;
        console.log(this.currentPeriod);
        if (this.currentPeriod !== 1){
            this.loadHistoryChart();
        }
        else {
            this.loadDailyChart();
        }
        
        
    }
    getSharesData(id){
        this.currentID = id;
    }
    getIndexShare(id){
        let index = -1;
        for (let i = 0 ; i < this.sharesChart.length; i++ )
            if (this.sharesChart[i].instrumentID == id)
                index = i;
        return index;    
    }
    getChartData(id,name,color){
        let length = this.sharesChart.length;
        if (this.getIndexShare(id) === -1){
            if (this.sharesChart.length < 5){
                this.sharesChart.push({instrumentID: id, shareName : name, color : color});
                if (this.currentPeriod !== 1){
                    this.chartCtrl.getHistoryData(id,this.currentPeriod,true).then(data=>{
                        if (data.length > 0){
                            this.chart.addSeries({   
                                id: id,
                                data: data,
                                name: name,
                                color: color
                            }, true);
                        }
                        
                    });
                }
                else {
                    this.chartCtrl.getDailyData(id,true).then(data=>{
                        if (data.length > 0){
                            this.chart.addSeries({   
                                id: id,
                                data: data,
                                name: name,
                                color: color
                            }, true);
                        }
                    });
                }
                
            }
            else {
                alert("Full choose");
            }
        }
        else {
            this.sharesChart = this.sharesChart.filter(function(el) {
                return el.instrumentID !== id;
            });
            this.chart.get(id).remove();
        }    
    }
}
