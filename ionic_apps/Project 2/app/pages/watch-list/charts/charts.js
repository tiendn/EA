
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
    this.currentPeriod = 1;
    // this.shares  = [{id:16569,name:'SHR1'}];
    this.instrumentID = [16569];
    this.shareName = ['SHR1'];
    // this.
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
    // this.chartCtrl.setOptions(Highcharts.theme);
    this.chartCtrl.getHistoryData(16569,this.currentPeriod,true).then(data=>{
        // console.log(data);
        this.chart.addSeries({   
            id : 16569,    
            name: 'SHR1',              
            data: data
        }, true);
    });
    // this.chart.redraw();
  }

//   Update 
    changePeriod(period){
        console.log(period);
        this.currentPeriod = period;
        console.log(this.currentPeriod);
        // console.log(this.chart.get(this.instrumentID[0]).data);
        for (let i = 0 ; i < this.instrumentID.length ; i++){
            this.chartCtrl.getHistoryData(this.instrumentID[i],period,true).then(data=>{
                this.chart.series[i].update({data : data});   
            });
        }
        // this.chart.redraw();
    }
    getSharesData(id){
        this.currentID = id;
    }
    getChartData(id,name){
        if (!this.instrumentID.includes(id)){
            if (this.instrumentID.length < 5){
                //  add Share Name
                this.shareName.push(name);
                //  Add instrumentID
                this.instrumentID.push(id);    
                this.chartCtrl.getHistoryData(id,this.currentPeriod,true).then(data=>{
                    this.chart.addSeries({   
                        id: id,
                        data: data,
                        name: name
                    }, true);
                });
            }
            else {
                alert("Full choose");
            }
        }
        else {
            this.chart.get(id).remove();
            this.shareName.splice([this.shareName.indexOf(name)],1);
            this.instrumentID.splice([this.instrumentID.indexOf(id)],1);
            // Xoa phan tu trong shares...
        }    
      console.log(this.shareName + ' ' + this.shareName.length);
      console.log(this.instrumentID+ ' ' + this.instrumentID.length);     
        
        
    }
}
