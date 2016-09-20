
import { Component } from '@angular/core';
import { ViewController,NavParams,Platform  } from 'ionic-angular';
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
      [NavParams],
      [Platform ]
    ];
  }
  constructor(viewCtrl,chartServices,NavParams,Platform) {
        this.viewCtrl = viewCtrl;
        this.navParam = NavParams;
        this.chartCtrl = chartServices;
        this.platform = Platform;
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
        this.recentDay = 0;
        this.countOwnShare = 1 ;
        // this.dateTimeArr = [];
        this.sharesChart = [
            {
                "instrumentID":32940,
                "shareName":'SHR1',
                "color" : 'white',
                "isOwnShare" : true
            }
           
        ];
        // this.color = ["white","blue","green","orange","yellow"];
        // console.log(this.sharesChart);
        this.listOwnShares = [
            {
                "instrumentID": 32940,
                "shareName":'SHR1',
                // "name" : "SHARE1",
                "color" : '#e27a8d'
            },
            {
                "instrumentID": 32864,
                "shareName":'SHR2',
                //  "name" : "SHARE2",
                "color" : 'pink'
            },
            {
                "instrumentID":39083,
                "shareName":'LSHR',
                //  "name" : "LONGSHARE",
                "color" : '#388733'
            }
        ]
        this.watchListShare = [
            {
                "instrumentID" : 16569,
                "shareName" : 'TICR1',
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
                "color": '#984617'
            },
            {
                "instrumentID" : 100980,
                "shareName" : 'TICR4',
                "color": 'orange'
            },
            {
                "instrumentID" : 16570,
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
            },
            title: {
                text: '',
            },
            tooltip: {
                valueDecimals: 2,
                valueSuffix: ' %'
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
                labels:{
                    style:{
                        color: '#808080',
                        fontSize : '10px'
                    }
                }
            },
            yAxis:{
                title : '',
                gridLineWidth: 0,
                opposite : true,
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    },
                    style:{
                        color: '#808080',
                        fontSize : '10px'
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
        // if (this.platform.is('iphone') && this.platform.is('android')) {
        //     this.chart.xAxis[0].labels.style({"color": '#808080',
        //                 "fontSize" : '10px'});
        //     this.chart.yAxis[0].labels.style({"color": '#808080',
        //     "fontSize" : '10px'});
        // }
         if (this.platform.is('ipad')){
            this.chart.xAxis[0].update({
                labels:{
                    style:{
                        color: '#808080',
                        fontSize : '15px'
                    }
                }
            });
            this.chart.yAxis[0].update({
                labels:{
                    style:{
                        color: '#808080',
                        fontSize : '15px'
                    }
                }
            });
        }
        this.chartCtrl.getHistoryData(this.sharesChart[0].instrumentID,this.currentPeriod,true).then(data=>{
            if (data.length > 0){
                if (this.currentPeriod === 1 )
                    this.recentDay = data[0][0];
                console.log(data);
                this.chart.addSeries({   
                    id : this.sharesChart[0].instrumentID,    
                    name: this.sharesChart[0].shareName,              
                    data: data,
                    color: this.sharesChart[0].color
                }, true);
            }
            else {
                console.log("This day have no data");
            }
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
                labels:{
                    style:{
                        color: '#808080',
                        fontSize : '10px'
                    }
                }
                
            },
            tooltip: {
                valueDecimals: 2,
                valueSuffix: ' %'
            },
            yAxis:{
                title : '',
                gridLineWidth: 0,
                opposite : true,
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    },
                    style:{
                        color: '#808080',
                        fontSize : '10px'
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
                this.chart.addSeries({   
                    id : this.watchListShare[i].instrumentID,    
                    name: this.watchListShare[i].shareName,              
                    data: data,
                    color: this.watchListShare[i].color
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
            },
            tooltip: {
                valueDecimals: 2,
                // valuePrefix: '$',
                valueSuffix: ' %'
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
                },
                labels:{
                    style:{
                        color: '#808080',
                        fontSize : '10px'
                    }
                }
            },
            yAxis:{
                title : '',
                gridLineWidth: 0,
                opposite : true,
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    },
                    style:{
                        color: '#808080',
                        fontSize : '10px'
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
        let choose = false;
        for (let i = 0 ; i < this.sharesChart.length ; i++){
            console.log(this.sharesChart[i].isOwnShare);    
            if (this.sharesChart[i].isOwnShare === true){
                this.chartCtrl.getLastDailyData(this.sharesChart[i].instrumentID,true).then(data=>{
                // console.log(this.sharesChart[i].instrumentID);
                    if (data.length > 0 ){
                        console.log(data[0][0]);
                        this.recentDay = data[0][0];
                        this.chart.addSeries({   
                            id : this.watchListShare[i].instrumentID,    
                            name: this.watchListShare[i].shareName,              
                            data: data,
                            // color: this.color[this.sharesChart.length]
                            color:  this.watchListShare[i].color
                        }, true);
                        choose = true;
                    }
                    // break;
                    // 
                });
                if (choose ) break;
                // console.log(recentDay);
            }
        }
        for (let i = 0 ; i < this.sharesChart.length ; i++){    
            if (this.sharesChart[i].isOwnShare !== true){
                this.chartCtrl.getDailyData(this.sharesChart[i].instrumentID,this.recentDay,true).then(data=>{
                // console.log(this.sharesChart[i].instrumentID);
                    // console.log(data[0][0]);
                    // console.log(data);
                    // recentDay = data[0][0];
                    if (data.length > 0 ){
                        this.chart.addSeries({   
                            id : this.watchListShare[i].instrumentID,    
                            name: this.watchListShare[i].shareName,              
                            data: data,
                            // color: this.color[this.sharesChart.length]
                            color:  this.watchListShare[i].color
                        }, true);
                    }
                });
            }
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
        if (this.platform.is('ipad')){
            this.chart.xAxis[0].update({
                labels:{
                    style:{
                        color: '#808080',
                        fontSize : '15px'
                    }
                }
            });
            this.chart.yAxis[0].update({
                labels:{
                    style:{
                        color: '#808080',
                        fontSize : '15px'
                    }
                }
            });
        }
        
    }
    // getSharesData(id){
    //     this.currentID = id;
    // }
    getIndexShare(id){
        let index = -1;
        for (let i = 0 ; i < this.sharesChart.length; i++ )
            if (this.sharesChart[i].instrumentID == id)
                index = i;
        return index;    
    }
    
    getChartData(id,name,color,bool){
        if (this.getIndexShare(id) === -1){
            if (this.sharesChart.length < 5){
                this.sharesChart.push({instrumentID: id, shareName : name, color : color, isOwnShare : bool});
                if (bool === true ) this.countOwnShare += 1;
                if (this.currentPeriod !== 1){
                    this.chartCtrl.getHistoryData(id,this.currentPeriod,true).then(data=>{
                        // console.log(data);
                        if (data.length > 0){
                            this.chart.addSeries({   
                                id: id,
                                data: data,
                                name: name,
                                // color: this.color[this.sharesChart.length-1]
                                color: color,
                            }, true);
                        }
                        
                    });
                }
                else if (this.currentPeriod === 1) {
                    // Kiem tra xem trong mang object da co ownshare chua, neu co thi lay recentDay
                    // Neu chua thay, gan gia tri cho recentday
                    // for (let i = 0 ; i < this.sharesChart.length ; i++){
                    //     if (this.sharesChart[i].isOwnShare === true)

                    // }
                    console.log(this.recentDay);
                    if (this.recentDay !== 0){
                        this.chartCtrl.getDailyData(id,this.recentDay,true).then(data=>{
                            // console.log(data.length);
                            if (data.length > 0){
                                this.chart.addSeries({   
                                    id: id,
                                    data: data,
                                    name: name,
                                    // color: this.color[this.sharesChart.length-1]
                                    color: color,
                                }, true);
                            }
                        });
                    }
                    else {
                        this.chartCtrl.getLastDailyData(id,true).then(data=>{
                            // console.log(data.length);
                            if (data.length > 0){
                                // console.log(data[0][0]);
                                this.recentDay = data[0][0];
                                this.chart.addSeries({   
                                    id: id,
                                    data: data,
                                    name: name,
                                    // color: this.color[this.sharesChart.length-1]
                                    color: color,
                                }, true);
                            }
                        });
                    }
                    
                }
            }
            else {
                console.log("Full choose");
            }
        }
        else {
            // console.log(this.countOwnShare);
            if (this.countOwnShare <= 1 ){
                if (this.sharesChart[this.getIndexShare(id)].isOwnShare == true ){
                    alert("Cannot delete this own share");
                }
                else{
                    this.sharesChart = this.sharesChart.filter(function(el) {
                        return el.instrumentID !== id;
                    });
                    if (this.chart.get(id) !== null)
                        this.chart.get(id).remove();
                }
            }
            else{
                // Xóa một own share .
                //  cần cập nhật lại day mới
                
                // console.log(id);
                // Giam count ownshare có trong charts
                if (this.sharesChart[this.getIndexShare(id)].isOwnShare == true ){
                    this.countOwnShare--;
                }
                // Lọc danh sách item được chọn
                this.sharesChart = this.sharesChart.filter(function(el) {
                    return el.instrumentID !== id;
                });
                // Xóa line được chọn
                if (this.chart.get(id) !== null)
                    this.chart.get(id).remove();
                // Vẽ lại đồ thị lấy cái mới. 
                // Phải lấy đúng ownshare đầu tiên đang được chọn
                console.log(this.sharesChart);
                let choose = false;
                for (let i = 0 ; i < this.sharesChart.length ; i++){
                // console.log(this.sharesChart[i].isOwnShare);    
                    if (this.sharesChart[i].isOwnShare === true){
                        if (choose) break;
                        this.chartCtrl.getLastDailyData(this.sharesChart[i].instrumentID,true)
                        .then(data=>{
                    // console.log(this.sharesChart[i].instrumentID);
                        console.log(this.chartCtrl.getDay(this.recentDay));
                        // console.log(data);
                            if (data.length > 0 ){
                               console.log(this.chartCtrl.getDay(data[0][0]));
                               if (this.chartCtrl.getDay(this.recentDay) === this.chartCtrl.getDay(data[0][0]))
                                   {}
                               else{
                                   this.recentDay = data[0][0];
                                   changePeriod(this.currentPeriod);
                                   
                                }
                                choose = true;
                                // Cần break khi chọn được ownshare thứ 2 .
                                // Nếu k sẽ lặp tới ownshare cuối cùng và lấy giá trị đó
                                // break;
                            }
                            // else break;
                        }, true);
                        
                    // });
                    }
              }
                
            }
        } 
            
    }    
        // console.log(this.sharesChart);
        // console.log(this.chart);
    // }
}
