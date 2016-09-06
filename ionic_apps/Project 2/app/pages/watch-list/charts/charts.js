
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
    this.shares = ['SHR1'];
    // Mot bien de luu cac ma dang duoc show ra.

    // this.chart = ;
    // chartServices.getHistoryData(16569,'3M',true);
    // this.provider = provider;
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  ionViewLoaded(){
      // mỗi một nút sẽ sử dụng update để fix chát.
      
    this.chart = new Highcharts.Chart({
        // colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', 
        // '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
        colors: ['white','blue','green','orange','yellow'],
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
            gridLineWidth: 1,
            // tickPixelInterval : 120,
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%b of %y'
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
        legend:{
            enabled: false
        },
        credits: {
            enabled: false
        },
        
    });
    this.chartCtrl.theme = {
        
    }
    // this.chartCtrl.setOptions(Highcharts.theme);
    this.chartCtrl.getHistoryData(16569,3,true).then(data=>{
        // console.log(data);
        this.chart.addSeries({   
            id : 'SHR1',    
            name: 'SHR1',              
            data: data
        }, true);
    });
    // this.chart.redraw();

  }
//   End ionViewLoaded
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
    getSharesData(id){
        this.currentID = id;
    }
    getChartData(id,share){
        if (!this.shares.includes(share)){
            if (this.shares.length < 5){
                this.shares.push(share);
                console.log(this.shares);
                this.chartCtrl.getHistoryData(id,3,true).then(data=>{
                    this.chart.addSeries({   
                        id: share,
                        data: data,
                        name: share
                    }, true);
                });
            }
            else {
                alert("Full choose");
            }
        }
        else {
            this.chart.get(share).remove();
            // Xoa phan tu trong shares...
        }    
           
        
        
    }
}
