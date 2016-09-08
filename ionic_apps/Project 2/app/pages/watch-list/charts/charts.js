
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
    this.instrumentIDs = [16569];
    this.shareNames = ['SHR1'];
    this.colors = ['white'];
    // console.log(this.listShare);
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
        //colors: ['white','blue','green','orange','yellow'],
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
            
            type: 'datetime',
            labels: {
                formatter: function() {
                    let first = this.chart.xAxis[0].getExtremes().dataMax;
                    let last = this.chart.xAxis[0].getExtremes().dataMin;
                    let mid = (first + last)/2;
                    // console.log(mid);
                    // console.log((this.chart.xAxis[0].getExtremes().dataMax + this.chart.xAxis[0].getExtremes().dataMin)/2);
                    if (this.value === first )
                        return (this.value);
                    }
                },
                // format: '{value:%Y-%m-%d}',
            // },
            // categories : [(this.chart.xAxis[0].getExtremes().dataMax + this.chart.xAxis[0].getExtremes().dataMin)/2]
            // dateTimeLabelFormats: {
            //     day: '%e of %b'
            // },
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
        // console.log(period);
        this.currentPeriod = period;
        // console.log(this.currentPeriod);
        // console.log(this.chart.get(this.instrumentID[0]).data);
        for (let i = 0 ; i < this.instrumentIDs.length ; i++){
            this.chartCtrl.getHistoryData(this.instrumentIDs[i],period,true).then(data=>{
                this.chart.series[i].update({data : data});   
            });
        }
        // this.chart.xAxis.update({
        //     xAxis:{
        //         categories: 
        //     }
        // });
        // this.chart.xAxis.update({
        //     xAxis: {
        //     dateTimeLabelFormats: {
        //         day: '%b of %y'
        //     },
        //  },
        // })
        
        // this.chart.redraw();
    }
    getSharesData(id){
        this.currentID = id;
    }
    getChartData(id,name,color){
        console.log(color);
        if (!this.instrumentIDs.includes(id)){
            if (this.instrumentIDs.length < 5){
                //  add Share Name
                this.shareNames.push(name);
                //  Add instrumentID
                this.instrumentIDs.push(id);    
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
            this.chart.get(id).remove();
            this.shareNames.splice([this.shareNames.indexOf(name)],1);
            this.instrumentIDs.splice([this.instrumentIDs.indexOf(id)],1);
            this.colors.splice([this.colors.indexOf(color)],1);
            // Xoa phan tu trong shares...
        }    
      console.log(this.shareNames + ' ' + this.shareNames.length);
      console.log(this.instrumentIDs+ ' ' + this.instrumentIDs.length);  
         
        
        
    }
}
