
import { Component } from '@angular/core';
import { NavParams,Platform,LoadingController  } from 'ionic-angular';
import { ChartServices} from '../../ProviderService/chart-services';
@Component({
    providers:[ChartServices],
    templateUrl: 'build/pages/watch-list/charts/charts.html',
})
export class ChartsPage {
  static get parameters() {
    return [
      [ChartServices],
      [NavParams],
      [Platform ],
      [LoadingController]
    ];
  }
  constructor(chartServices,NavParams,Platform,LoadingController) {
        this.loadingCtrl= LoadingController;
        this.navParam = NavParams;
        this.chartCtrl = chartServices;
        this.platform = Platform;
        if (this.navParam.data === "Watchlist"){
            this.type = 0;
            // danh sách các period
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
            this.ownShareTitle = "OWN SHARES";
            this.watchListSharesTitle = "INDICES";
        }
        this.tooltip = "Tap on the ticker codes below to compare them. We limit the charting to five tickers." ;
        // Set default Period = 3
        this.currentPeriod = 3; 

        this.recentTime  = [
            {
                "recentDay" : 0,
                "instrumentID" : 0,
                "priority" : 1
            }
            
        ];
        // ownshare mặc định được chọn
        this.ownShare = [
                {
                    "instrumentID" : 32940,
                    "priority" : 1
                }
            ];
        // Mảng màu
        this.colors = [
            {
                "color" : "#FFFFFF",
                "isSelected" : false
            },
            {
                "color" : "#4A90E2",
                "isSelected" : false
            },
            {
                "color" : "#7ED321",
                "isSelected" : false
            },
            {
                "color" : "#FF7F0E",
                "isSelected" : false
            },
            {
                "color" : "#FF6275",
                "isSelected" : false
            }
       ];
        // Array Object các share được chọn vẽ lên chart
        this.sharesChart = [
            {
                "instrumentID":32940,
                "shareName":'SHR1',
                "color" : this.colors[0].color,
                "isOwnShare" : true
            }
           
        ];
        // Danh sách các ownshare.
        this.configOwnShares = [
            {
                "instrumentID": 32940,
                "shareName":'SHR1',
                "priority" : 1
            },
            {
                "instrumentID": 32864,
                "shareName":'SHR2',
                "priority" : 2
            },
            {
                "instrumentID": 70003,
                "shareName":'LSHR',
                "priority" : 3
            }
        ]
        this.listOwnShares = [];
        for (let i = 0 ; i < this.configOwnShares.length ; i++ ){
            this.listOwnShares.push(
                {
                    instrumentID : this.configOwnShares[i].instrumentID,
                    shareName : this.configOwnShares[i].shareName,
                    priority : i + 1
                })
        }
        // Danh sách các share
        this.watchListShare = [
            {
                "instrumentID" : 16569,
                "shareName" : 'TICR1',
            },
            {
                "instrumentID" : 39083,
                "shareName" : 'TICR2',
            },
            {
                "instrumentID" : 71957,
                "shareName" : 'TICR3',
            },
            {
                "instrumentID" : 100980,
                "shareName" : 'TICR4',
            },
            {
                "instrumentID" : 16570,
                "shareName" : 'TICR5',
            },
            {
                "instrumentID" : 32865,
                "shareName" : 'TICR6',
            }
        ]
    }
    
    // Get index of this instrumentID on sharesChart array object.
    getIndexShare(id){
        // let index = -1;
        for (let i = 0 ; i < this.sharesChart.length; i++ )
            if (this.sharesChart[i].instrumentID === id)
                return i;
        return -1;    
    }
    // Get color that not choosed in list
    getColor(){
        for (let i = 0 ; i < this.colors.length; i++ )
            if (this.colors[i].isSelected === false){
                this.colors[i].isSelected = true;
                return this.colors[i].color;  
            }
        return undefined;
    }
    // Delete color from list 
    deleteColor(color){
        for ( let i = 0 ; i < this.colors.length; i++)
            if (this.colors[i].color === color ){
                this.colors[i].isSelected = false;
                break;
            }
    }
    // Reset colors list
    resetColor(){
        for (let i = 0 ; i < this.colors.length ; i++ ){
            this.colors[i].isSelected = false;
        }
    }
    addSeries(id,name,data,color){
        this.chart.addSeries({   
            id: id,
            data: data,
            name: name,
            color: color,
        }, true);
    }
    ionViewLoaded(){
        // Draw chart at first
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
                valueSuffix: ' %',
                shared:true
                
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
            }
        });
        // If this device is Ipad, change label font-size 
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
        // Add data at first time with 3D period
        this.chartCtrl.getHistoryData(this.sharesChart[0].instrumentID,this.currentPeriod,true).then(data=>{
            this.colors[0].isSelected = true;
            if (data.length > 0){
                // add Series
                this.addSeries(this.sharesChart[0].instrumentID,this.sharesChart[0].shareName,data,this.colors[0].color);
                // this.chart.addSeries({   
                //     id : this.sharesChart[0].instrumentID,    
                //     name: this.sharesChart[0].shareName,              
                //     data: data,
                //     color: this.colors[0].color
                // }, true);
                
            }
            else {
                // console.log("This day have no data");
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
                valueSuffix: ' %',
                shared:true
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
        // Load data again
        for (let i = 0 ; i < this.sharesChart.length ; i++){
            this.chartCtrl.getHistoryData(this.sharesChart[i].instrumentID,this.currentPeriod,true).then(data=>{
                if (data.length > 0 ){
                    this.addSeries(this.sharesChart[i].instrumentID,this.sharesChart[i].shareName,data,this.colors[i].color);
                    // this.chart.addSeries({   
                    //     id : this.sharesChart[i].instrumentID,    
                    //     name: this.sharesChart[i].shareName,              
                    //     data: data,
                    //     color: this.colors[i].color
                    // }, true);                
                }
                // Set color for this.sharesChart array object, and check this color isSelected is true
                this.sharesChart[i].color = this.colors[i].color;
                this.colors[i].isSelected = true;
            });

        }
    }
    // Load data by a day
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
                valueSuffix: ' %',
                shared:true
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
        // Đệ quy
        var arr = this.sharesChart.slice();
        let index = 0;
        var getShareData = (arr,index) => {
            if (arr.length > 0 ){
                let share = arr[0]; // get first element 
                arr = arr.slice(1); // Erase first element
                if (share.isOwnShare){ // if this element have attr isOwnShare
                    this.chartCtrl.getLastDailyData(share.instrumentID,true).then(data=>{
                        if (data.length > 0 ){ // If recentDay have data.
                            // Assign value recentTime
                            this.recentTime[0].recentDay = data[0][0];
                            this.recentTime[0].instrumentID = share.instrumentID;
                            // Add series 
                            this.addSeries(share.instrumentID,share.shareName,data,this.colors[0].color);
                            // this.chart.addSeries({   
                            //     id : share.instrumentID,    
                            //     name: share.shareName,              
                            //     data: data,
                            //     color: this.colors[0].color
                            // }, true);
                            this.sharesChart[index].color = this.colors[0].color;
                            this.colors[0].isSelected = true;
                            // Add another share with recentDay parameter
                            for (let i = 0 ; i < this.sharesChart.length ; i++){  
                                if (this.sharesChart[i].instrumentID !== share.instrumentID){ 
                                    this.chartCtrl.getDailyData(this.sharesChart[i].instrumentID,this.recentTime[0].recentDay,true).then(data=>{
                                        let color = this.getColor(); 
                                        if (data.length > 0 ){ // If this share have data.
                                            this.addSeries(share.instrumentID,share.shareName,data,color);
                                            // this.chart.addSeries({   
                                            //     id : this.sharesChart[i].instrumentID,    
                                            //     name: this.sharesChart[i].shareName,              
                                            //     data: data,
                                            //     color:  color
                                            // }, true);
                                        }
                                        this.sharesChart[i].color = color;
                                    });
                                }    
                            }
                        }
                        else { // If not satified, continue seek.
                            if ( index + 1 < this.sharesChart.length ){
                                index++;
                                getShareData(arr,index);
                            }
                        }
                    });
                }
                else { // If not satified, continue seek.
                    if ( index + 1 < this.sharesChart.length ){
                        index++;
                        getShareData(arr,index);
                    }
                }
            }
        };
        getShareData(arr,index);
    } 

    //   Update 
    changePeriod(period){
        // Assign currentPeriod
        this.currentPeriod = period;
        this.resetColor();
        // If 1D period
        if (this.currentPeriod !== 1){
            this.loadHistoryChart();
        }
        // If another period
        else {
            this.loadDailyChart();
        }
        // If this device is IPad change font-size
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
    
    // Add a share on chart.
    getChartData(id,name,priority,bool){
        console.log(this.sharesChart);
        // If this instrumentID isn't on list shares
        if (this.getIndexShare(id) === -1){ 
            if (this.sharesChart.length < 5){ // If the number of Shares < 5
                // Get color
                var color = this.getColor(); 
                // Push attr on sharesChart arr object.
                this.sharesChart.push({instrumentID: id, shareName : name, color : color, isOwnShare : bool});
                // if this share is ownshare , sort this.ownShare arr obj by priority attr
                if (bool === true){
                    this.ownShare.push({instrumentID: id,priority: priority});
                    this.ownShare.sort(function(a,b) {
                        return a.priority - b.priority;
                    });
                }
                // If current Period # 1
                if (this.currentPeriod !== 1){ 
                    this.chartCtrl.getHistoryData(id,this.currentPeriod,true).then(data=>{
                        if (data.length > 0){
                            this.addSeries(id,name,data,color);
                            // this.chart.addSeries({   
                            //     id: id,
                            //     data: data,
                            //     name: name,
                            //     color: color,
                            // }, true);
                        }
                    });
                }
                // If current Period = 1
                else if (this.currentPeriod === 1) { 
                    // If this share is ownshare
                    if (this.sharesChart[this.getIndexShare(id)].isOwnShare === true ){ 
                        // If this ownshare have higher priority (in real life.) than current recent ownshare 
                        if (this.recentTime[0].priority > priority){ 
                            // Get data
                            this.chartCtrl.getLastDailyData(id,true).then(data=>{
                                if (data.length > 0){
                                    //If this ownshare higher priority have the different day with this current ownshare was choose for get time
                                    if (this.chartCtrl.getDay(this.recentTime[0].recentDay) !== this.chartCtrl.getDay(data[0][0])){
                                        // Assign recentTime
                                        this.recentTime[0].recentDay = data[0][0]; 
                                        this.recentTime[0].instrumentID = id;
                                        this.recentTime[0].priority = priority;
                                        
                                        // Erase all share on highcharts
                                        for (let i = 0 ; i < this.sharesChart.length ; i++){
                                            if (this.chart.get(this.sharesChart[i].instrumentID) !== undefined)
                                                this.chart.get(this.sharesChart[i].instrumentID).remove();
                                        }
                                        // Reset color
                                        resetColor();
                                        /**
                                         * Redraw highcharts by this ownshare time
                                         */
                                        // Add new serie 
                                        this.addSeries(id,name,data,this.colors[0].color);
                                        // this.chart.addSeries({   
                                        //         id: id,
                                        //         data: data,
                                        //         name: name,
                                        //         color: this.colors[0].color,
                                        // }, true);
                                        // Because this ownshare add last so this index is (this.sharesChart.length-1)
                                        this.sharesChart[this.sharesChart.length-1].color = this.colors[0].color;
                                        this.colors[0].isSelected = true;
                                        // Add all share remain again.
                                        for (let i = 0 ; i < this.sharesChart.length ; i++){
                                            this.chartCtrl.getDailyData(id,this.recentTime[0].recentDay,true).then(data=>{
                                                let color = this.getColor();
                                                if (data.length > 0){
                                                    this.addSeries(id,name,data,color);
                                                    // this.chart.addSeries({   
                                                    //     id: id,
                                                    //     data: data,
                                                    //     name: name,
                                                    //     color: anotherColor,
                                                    // }, true);
                                                }
                                                this.sharesChart[i].color = color;
                                            });
                                        }
                                    }
                                    // If this ownshare higher priority have the same day with this current ownshare was choose for get time
                                    this.recentTime[0].instrumentID = id;
                                    this.recentTime[0].priority = priority;  
                                    console.log(this.recentTime[0].instrumentID);
                                    this.addSeries(id,name,data,color);
                                    // this.chart.addSeries({   
                                    //     id: id,
                                    //     data: data,
                                    //     name: name,
                                    //     color: color,
                                    // }, true);
                                    
                                }
                            });
                        }
                        // If this ownshare have lower priority (in real life.) than current recent ownshare
                        else{
                            if (this.recentTime[0].recentDay !== 0){ // If recent time have data.
                        // Get data
                                this.chartCtrl.getDailyData(id,this.recentTime[0].recentDay,true).then(data=>{
                                    if (data.length > 0){
                                        this.addSeries(id,name,data,color);
                                        // this.chart.addSeries({   
                                        //     id: id,
                                        //     data: data,
                                        //     name: name,
                                        //     // color: this.color[this.sharesChart.length-1]
                                        //     color: color,
                                        // }, true);
                                    }
                                });
                            }
                        }
                    }
                    else{ // If this share isn't ownshare
                        if (this.recentTime[0].recentDay !== 0){ // If recent time have data.
                        // Get data
                            this.chartCtrl.getDailyData(id,this.recentTime[0].recentDay,true).then(data=>{
                                if (data.length > 0){
                                    this.addSeries(id,name,data,color);
                                    // this.chart.addSeries({   
                                    //     id: id,
                                    //     data: data,
                                    //     name: name,
                                    //     color: color,
                                    // }, true);
                                }
                            });
                        }
                    }
                    
                }
            }
            else { // the number of share > 5 
                
                console.log("Full choose");
            }
        }
        else { // If this share is on list, erase
            if (this.ownShare.length <= 1 ){ // If the number of ownshare <=1 
                if (this.sharesChart[this.getIndexShare(id)].isOwnShare == true ){
                    // console.log("Cannot delete this own share");
                }
                else{ // If this share isn't ownshare
                    
                    // This color is not selected.
                        this.deleteColor(this.sharesChart[this.getIndexShare(id)].color);
                    // Filter 
                    this.sharesChart = this.sharesChart.filter(function(el) {
                        return el.instrumentID !== id;
                    });
                    // Erase line have this instrumentID
                    if (this.chart.get(id) !== null) // Nếu id đó có trong đồ thị
                        this.chart.get(id).remove();
                    
                    
                }
            }
            else{ // Nếu the number of ownshare >1  
                
                if (this.sharesChart[this.getIndexShare(id)].isOwnShare == true ){
                    // Filter this.ownshare
                    this.ownShare = this.ownShare.filter(function(el) {
                        return el.instrumentID != id;
                    });
                }
                // This color is not selected.
                    this.deleteColor(this.sharesChart[this.getIndexShare(id)].color);
                        
                // filter
                this.sharesChart = this.sharesChart.filter(function(el) {
                    return el.instrumentID !== id;
                });
                // Erase line have this instrumentID
                if (this.chart.get(id) !== null)
                    this.chart.get(id).remove();
                // Sort share
                this.ownShare.sort(function(a,b) {
                    return a.priority - b.priority;
                });
                //  If recentTime have the same day with this ownshare  and currentPeriod = 1;
                if (this.recentTime[0].instrumentID === id && this.currentPeriod === 1) {
                    this.chartCtrl.getLastDailyData(this.ownShare[0].instrumentID,true)
                    .then(data=>{
                        if (data.length > 0 ){ 
                            this.choose = true;
                            if (this.chartCtrl.getDay(this.recentTime[0].recentDay) === this.chartCtrl.getDay(data[0][0]))
                                {
                                    // console.log("Dữ liêu cùng ngày ! ");
                                    this.recentTime[0].instrumentID = this.ownShare[0].instrumentID;
                                    this.recentTime[0].priority = this.ownShare[0].priority;
                                    console.log(this.recentTime[0].instrumentID);
                                } 
                            else{
                              
                                this.recentTime[0].recentDay = data[0][0];
                                this.recentTime[0].instrumentID = id;
                                this.recentTime[0].priority = priority;
                                // Redraw highcharts
                                changePeriod(this.currentPeriod);
                            }
                        }
                    }, true);
                } // End case "If recentTime have the same day with this ownshare  and currentPeriod = 1;"
                
            } // End number of ownshare > 1 case
        } // End erase this share
        console.log(this.sharesChart);
    }     // End getData.
}
