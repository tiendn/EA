
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
    // this.instrumentIDs = [16569];
    // this.shareNames = ['SHR1'];
    // this.colors = ['white'];
    
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  ionViewLoaded(){
      // mỗi một nút sẽ sử dụng update để fix chát.
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
            tickInterval: 1 * 30 * 24 * 60 * 60 * 1000,            
            type: 'datetime',
            tickLength: 0,
            gridLineColor: '#848484',
            lineColor: '#484849',
            lineWidth: 1,
            dateTimeLabelFormats: {
                month: '%b\' %e'
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
        this.currentPeriod = period;
        console.log(this.currentPeriod);
        var dateTimeFormat = [
            {
                1 : '%b\' %e',
                3 : '%b\' %y',
                6 : '%b\' %y',
                12 : '%y',
                36 : '%y'
            }
        ]
        for (let i = 0 ; i < this.sharesChart.length ; i++){
            if (this.currentPeriod === 1 ){
                this.chartCtrl.getDailyData(this.sharesChart[i].instrumentID,true).then(data=>{
                    this.chart.series[i].update({data : data});   
                });
            } 
            else {
                console.log(dateTimeFormat[0][this.currentPeriod]);
                this.chartCtrl.getHistoryData(this.sharesChart[i].instrumentID,this.currentPeriod,true).then(data=>{
                    this.chart.series[i].update({data : data});   
                });
            }
        }
        this.chart.xAxis[0].update({
            xAxis:{
                tickInterval: this.currentPeriod * 30 * 24 * 60 * 60 * 1000,
                dateTimeLabelFormats: {
                        month: dateTimeFormat[0][this.currentPeriod]
                }, 
            }
        });
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
        console.log(color);
        // 
        // let object = [
        //     {
        //         "instrumentID" : id,
        //         "shareName" : name,
        //         "color" : color
        //     }
        // ]
        let length = this.sharesChart.length;
        if (this.getIndexShare(id) === -1){
            if (this.sharesChart.length < 5){
                //  add Share Name
                this.sharesChart.push({instrumentID: id, shareName : name, color : color});
                // this.sharesChart.length++;
                // this.sharesChart[length].instrumentID = id;
                // //  Add instrumentID
                // this.sharesChart[length].shareName = name;    
                // this.sharesChart[length].color = color;  


                //// Add them mot phan tu vao object.
                // this.sharesChart.push(object);  
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
            // this.listShare
            // Filter //
            //someArray = [{name:"Kristian", lines:"2,5,10"},
            //              {name:"John", lines:"1,19,26,96"},
            //              {name:"Brian",lines:"3,9,62,36" }];
            this.sharesChart = this.sharesChart.filter(function(el) {
                return el.instrumentID !== id;
            });
            // this.chart.get(id).remove();
            // this.shareNames.splice([this.shareNames.indexOf(name)],1);
            // this.instrumentIDs.splice([this.instrumentIDs.indexOf(id)],1);
            // this.colors.splice([this.colors.indexOf(color)],1);
            // Xoa phan tu trong shares...
        }    
        // if (!this.instrumentIDs.includes(id)){
        //     if (this.instrumentIDs.length < 5){
        //         //  add Share Name
        //         this.shareNames.push(name);
        //         //  Add instrumentID
        //         this.instrumentIDs.push(id);    
        //         this.colors.push(color);
        //         this.chartCtrl.getHistoryData(id,this.currentPeriod,true).then(data=>{
        //             this.chart.addSeries({   
        //                 id: id,
        //                 data: data,
        //                 name: name,
        //                 color: color
        //             }, true);
        //         });
        //     }
        //     else {
        //         alert("Full choose");
        //     }
        // }
        // else {
        //     // this.listShare
        //     // Filter //
        //     //someArray = [{name:"Kristian", lines:"2,5,10"},
        //     //              {name:"John", lines:"1,19,26,96"},
        //     //              {name:"Brian",lines:"3,9,62,36" }];
        //     // johnRemoved = someArray.filter(function(el) {
        //     //     return el.name !== "John";
        //     // });
        //     this.chart.get(id).remove();
        //     this.shareNames.splice([this.shareNames.indexOf(name)],1);
        //     this.instrumentIDs.splice([this.instrumentIDs.indexOf(id)],1);
        //     this.colors.splice([this.colors.indexOf(color)],1);
        //     // Xoa phan tu trong shares...
        // }    
      console.log(this.sharesChart);
    //   console.log(this.instrumentIDs+ ' ' + this.instrumentIDs.length);  
         
        
        
    }
}
