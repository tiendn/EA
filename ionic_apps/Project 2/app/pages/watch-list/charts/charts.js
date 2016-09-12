
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
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
    ];
  }
  constructor(viewCtrl,chartServices) {
    this.viewCtrl = viewCtrl;
    this.chartCtrl = chartServices;
    this.currentID = 1;
    this.currentPeriod = 3;
    this.dateTimeArr = [];
    this.sharesChart  = [
        {
            "instrumentID":16569,
            "shareName":'SHR1',
            "color" : 'white'
        }
    ];
    console.log(this.sharesChart);
    this.listShare = [
        {
            "instrumentID" : 16569,
            "shareName" : 'SHR1',
            "color": 'white'
        },
        {
            "instrumentID" : 32864,
            "shareName" : 'TICR2',
            "color": 'blue'
        },
        {
            "instrumentID" : 39083,
            "shareName" : 'TICR3',
            "color": 'green'
        },
        {
            "instrumentID" : 69291,
            "shareName" : 'TICR4',
            "color": 'orange'
        },
        {
            "instrumentID" : 16570,
            "shareName" : 'TICR5',
            "color": 'yellow'
        },
        {
            "instrumentID" : 39084,
            "shareName" : 'TICR6',
            "color": 'red'
        }
    ]
 
    
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  ionViewLoaded(){
    this.loadChart();
  }
  loadChart(){
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
    // this.chartCtrl.setOptions(Highcharts.theme);
    this.chartCtrl.getHistoryData(this.listShare[0].instrumentID,this.currentPeriod,true).then(data=>{
        console.log(data);
        this.chart.addSeries({   
            id : this.listShare[0].instrumentID,    
            name: this.listShare[0].shareName,              
            data: data,
            color: this.listShare[0].color
        }, true);
    });
    // this.chart.redraw();
  }

//   Update 
    changePeriod(period){
        // Xét period hiện tại
        this.currentPeriod = period;
        this.loadChart();
       
    }
    getSharesData(id){
        this.currentID = id;
    }
    getIndexShare(id){
        let index = -1;
        for (let i = 0 ; i < this.sharesChart.length; i++ )
            if (this.sharesChart[i].instrumentID == id)
                index = i;
        // console.log(index);
        return index;
    }
    getChartData(id,name,color){
        let length = this.sharesChart.length;
        if (this.getIndexShare(id) === -1){
            if (this.sharesChart.length < 5){
                this.sharesChart.push({instrumentID: id, shareName : name, color : color});
                this.chartCtrl.getHistoryData(id,this.currentPeriod,true).then(data=>{
                    this.chart.addSeries({   
                        id: id,
                        data: data,
                        name: name,
                        color: color
                    }, true);
                });
            }
            else {
                alert("Full choose");
            }
        }
        else {
            this.sharesChart = this.sharesChart.filter(function(el) {
                return el.instrumentID !== id;
            });
        }    
       
      console.log(this.sharesChart);
    }
}
