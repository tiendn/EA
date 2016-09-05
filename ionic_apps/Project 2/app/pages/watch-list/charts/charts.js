
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
    // Mot bien de luu cac ma dang duoc show ra.

    // this.chart = ;
    // chartServices.getHistoryData(16569,'3M',true);
    // this.provider = provider;
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  ionViewLoaded(){
    this.chart = new Highcharts.Chart({
        // colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', 
        // '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
        chart : {
            backgroundColor: '#484849',
            renderTo : 'charts',
            type     : 'line'
        },
       
        title: {
            text: '',
            style: {
                color: 'white',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        xAxis: {
                gridLineWidth: 0,
                tickInterval : 0,
            // categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
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
        legend:{
            enabled: false
        },
        credits: {
            enabled: false
        },
        
    });
    this.chartCtrl.getHistoryData(16569,3,true).then(data=>{
        this.chart.addSeries({   
            id : 'SHR1',                     
            name: 'Monkey',
            data: data
        }, true);
    });
    // this.chart.redraw();
  }
//   Update 
// http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/members/series-update/
    click(){
        this.chartCtrl.getHistoryData(16569,6,true).then(data=>{
            // Set new data. 
            this.chart.series[0].setData(data);
            //  Push more
        //    this.chart.series[0].data.push(data);
        });
        // this.chart.redraw();
    }
    changePeriod(period){
        alert(period);
    }
}
