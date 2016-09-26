
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
            //  
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
        // Sét mặc định là period 3M 
        this.currentPeriod = 3; 
        // Lấy ngày gần nhất có dữ liệu của ownshare đầu tiên, truyền cho các share khác 
        this.recentDay = 0;
        this.recentTime  = [
            {
                "recentDay" : 0,
                "instrumentID" : 0,
                "priority" : 1
            }
            
        ];
        // Đếm số ownshare được chọn
        // this.countOwnShare = 1 ;
        this.ownShare = [
                {
                    "instrumentID" : 32940,
                    "priority" : 1
                }
            ];
        // Mảng màu
        this.colors = [
            {
                "color" : "white",
                "isSelected" : false
            },
            {
                "color" : "blue",
                "isSelected" : false
            },
            {
                "color" : "green",
                "isSelected" : false
            },
            {
                "color" : "red",
                "isSelected" : false
            },
            {
                "color" : "yellow",
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
                // "name" : "SHARE1",
                // "color" : '#e27a8d',
                "priority" : 1
            },
            {
                "instrumentID": 32864,
                "shareName":'SHR2',
                //  "name" : "SHARE2",
                // "color" : 'pink',
                "priority" : 2
            },
            {
                "instrumentID": 70003,
                "shareName":'LSHR',
                //  "name" : "LONGSHARE",
                // "color" : '#388733',
                "priority" : 3
            }
        ]
        this.listOwnShares = [];
        for (let i = 0 ; i < this.configOwnShares.length ; i++ ){
            this.listOwnShares.push(
                {
                    instrumentID : this.configOwnShares[i].instrumentID,
                    shareName : this.configOwnShares[i].shareName,
                    // color : this.configOwnShares[i].color,
                    priority : i + 1
                })
        }
        //  = this.configOwnShares.slice();
        // Danh sách các share
        this.watchListShare = [
            {
                "instrumentID" : 16569,
                "shareName" : 'TICR1',
                // "color": 'white'
            },
            {
                "instrumentID" : 39083,
                "shareName" : 'TICR2',
                // "color": 'blue'
            },
            {
                "instrumentID" : 71957,
                "shareName" : 'TICR3',
                // "color": '#984617'
            },
            {
                "instrumentID" : 100980,
                "shareName" : 'TICR4',
                // "color": 'orange'
            },
            {
                "instrumentID" : 16570,
                "shareName" : 'TICR5',
                // "color": 'yellow'
            },
            {
                "instrumentID" : 32865,
                "shareName" : 'TICR6',
                // "color": 'red'
            }
        ]
    }
    // Close Modal
    dismiss(){
        this.viewCtrl.dismiss();
    }
    ionViewLoaded(){
        // Vẽ chart lần đầu tiên
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
                // Lấy độ rộng các cột theo thời gian
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
        // Nếu là IPad chỉnh lại font-size label
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
        // add dữ liệu khởi tạo vào đồ thị với trường hợp 3M mặc định 
        this.chartCtrl.getHistoryData(this.sharesChart[0].instrumentID,this.currentPeriod,true).then(data=>{
            if (data.length > 0){
                // Thêm dữ liệu ban đầu
                this.chart.addSeries({   
                    id : this.sharesChart[0].instrumentID,    
                    name: this.sharesChart[0].shareName,              
                    data: data,
                    // color: this.sharesChart[0].color
                    color: this.colors[0].color
                }, true);
                this.colors[0].isSelected = true;
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
        // Load lại dữ liệu
        for (let i = 0 ; i < this.sharesChart.length ; i++){
            this.chartCtrl.getHistoryData(this.sharesChart[i].instrumentID,this.currentPeriod,true).then(data=>{
                if (data.length > 0 ){
                    this.chart.addSeries({   
                        id : this.sharesChart[i].instrumentID,    
                        name: this.sharesChart[i].shareName,              
                        data: data,
                        color: this.colors[i].color
                    }, true);                
                    this.sharesChart[i].color = this.colors[i].color;
                    this.colors[i].isSelected = true;
                }
            });

        }
    }
    // Load dữ liệu theo ngày, dạng 1D
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
        // Đệ quy
        var arr = this.sharesChart.slice();
        let index = -1;
        var $scope = this;
        console.log(arr);
        getShareData(arr,index);
        function getShareData(arr,index){
            if (arr.length > 0 ){
                let share = arr[0]; // Lấy ra phần tử đầu tiên
                arr = arr.slice(1); //Xóa phần tử đầu tiên 
                if (share.isOwnShare){ // Nếu là ownshare
                    $scope.chartCtrl.getLastDailyData(share.instrumentID,true).then(data=>{
                        if (data.length > 0 ){ // dữ liệu ngày gần nhất > 0
                            // Gán giá trị thuộc tính ngày gần nhất
                            $scope.recentTime[0].recentDay = data[0][0];
                            $scope.recentTime[0].instrumentID = share.instrumentID;
                            // Add series vào đồ thị
                            $scope.chart.addSeries({   
                                id : share.instrumentID,    
                                name: share.shareName,              
                                data: data,
                                // color: this.color[this.sharesChart.length]
                                color:  $scope.colors[0].color
                            }, true);
                            $scope.sharesChart[0].color = $scope.colors[0].color;
                            // Add các series khác vào đồ thị dựa vào recentDay vừa tính được ở trên.
                            for (let i = 0 ; i < arr.length ; i++){    
                                $scope.chartCtrl.getDailyData(arr[i].instrumentID,$scope.recentTime[0].recentDay,true).then(data=>{
                                    if (data.length > 0 ){ // Kiểm tra nếu data k có dữ liệu thì k thêm vào 
                                        $scope.chart.addSeries({   
                                            id : arr[i].instrumentID,    
                                            name: arr[i].shareName,              
                                            data: data,
                                            // color: this.color[this.sharesChart.length]
                                            color:  $scope.colors[i+1].color
                                        }, true);

                                        $scope.sharesChart[i+1].color = $scope.colors[i+1].color;
                                        $scope.colors[i].isSelected = true;
                                    }
                                    
                                });
                                // }
                            }

                        }
                        else { // Nếu k thỏa mãn, tiếp tục tìm phần tử kế bên
                            index++;
                            getShareData(arr,index);
                        }
                    });
                }
                else { // Nếu k thỏa mãn, tiếp tục tìm phần tử kế bên
                    index++;
                    getShareData(arr,index);
                }
            }
        };
    }

    //   Update 
    changePeriod(period){
        // Xét period hiện tại
        this.currentPeriod = period;
        // console.log(this.currentPeriod);
        // Nếu 1D
        if (this.currentPeriod !== 1){
            this.loadHistoryChart();
        }
        // nếu các trường hợp còn lại
        else {
            this.loadDailyChart();
        }
        // Thay đổi lại font-size khi là IPad
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
    // Lấy vị trí của id trong mảng đối tượng share được vẽ trên chart
    getIndexShare(id){
        let index = -1;
        for (let i = 0 ; i < this.sharesChart.length; i++ )
            if (this.sharesChart[i].instrumentID == id)
                index = i;
        return index;    
    }
    getColor(){
        for (let i = 0 ; i < this.colors.length; i++ )
            if (this.colors[i].isSelected === false){
                this.colors[i].isSelected = true;
                return this.colors[i].color;  
            }
        return null;
    }
    deleteColor(color){
        console.log(color);
        for ( let i = 0 ; i < this.colors.length; i++)
            if (this.colors[i].color === color ){
                this.colors[i].isSelected = false;
                break;
            }
    }
    // Nhận share và vẽ lên đồ thị
    getChartData(id,name,priority,bool){
        if (this.getIndexShare(id) === -1){ // Nếu instrumentID đó chưa có trong danh sách được vẽ lên
            if (this.sharesChart.length < 5){ // Nếu số item được chọn < 5
                // Đẩy share vào danh sách chọn
                var color = this.getColor(); // Lấy màu
                console.log(color);
                // Đưa các thuộc tính vào mảng object 
                this.sharesChart.push({instrumentID: id, shareName : name, color : color, isOwnShare : bool});
                console.log(this.sharesChart);
                // Nếu là ownshare sắp xếp lại mảng ownshare
                if (bool === true){
                    this.ownShare.push({instrumentID: id,priority: priority});
                    this.ownShare.sort(function(a,b) {
                        return a.priority - b.priority;
                    });
                }

                    
                if (this.currentPeriod !== 1){ // Nếu period hiện tại # 1
                    this.chartCtrl.getHistoryData(id,this.currentPeriod,true).then(data=>{
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
                else if (this.currentPeriod === 1) { // Nếu 1D
                    if (this.sharesChart[this.getIndexShare(id)].isOwnShare === true ){ // Nếu share được chọn là ownshare
                        // console.log(priority);
                        if (this.recentTime[0].priority > priority){ // nếu ownshare được chọn có ưu tiên cao hơn thì lấy lại data
                            // console.log(priority);
                            this.chartCtrl.getLastDailyData(id,true).then(data=>{
                                if (data.length > 0){
                                    if (this.chartCtrl.getDay(this.recentTime[0].recentDay) !== this.chartCtrl.getDay(data[0][0])){
                                        this.recentTime[0].recentDay = data[0][0]; // Gán ngày gần nhất
                                        this.recentTime[0].instrumentID = id;
                                        this.recentTime[0].priority = priority;
                                        
                                        // Xoá hết các id cũ trong đồ thị
                                        for (let i = 0 ; i < this.sharesChart.length ; i++)
                                            if (this.chart.get(this.sharesChart[i].instrumentID) !== null)
                                                this.chart.get(this.sharesChart[i].instrumentID).remove();

                                        // Vẽ lại với dữ liệu mới
                                        for (let i = 0 ; i < this.sharesChart.length ; i++){
                                            this.chartCtrl.getDailyData(id,this.recentTime[0].recentDay,true).then(data=>{
                                                if (data.length > 0){
                                                    this.chart.addSeries({   
                                                        id: id,
                                                        data: data,
                                                        name: name,
                                                        // color: this.color[this.sharesChart.length-1]
                                                        color: this.colors[i+1].color,
                                                    }, true);
                                                }
                                            });
                                        }
                                    } // Nếu dữ liệu ngày ownshare độ ưu tiên cao hơn khác ngày với ngày được chọn hiện tại của ownshare ưu tiên thấp hơn 

                                    this.chart.addSeries({   
                                            id: id,
                                            data: data,
                                            name: name,
                                            // color: this.color[this.sharesChart.length-1]
                                            color: this.colors[0].color,
                                        }, true);
                                    
                                }
                            });
                        }
                        // Nếu ownshare được chọn có ưu tiên kém hơn
                        else{
                            if (this.recentTime[0].recentDay !== 0){ // Nếu có ngày gần nhất có dữ liệu
                        // Lấy dữ liệu với tham số ngày truyền vào 
                                this.chartCtrl.getDailyData(id,this.recentTime[0].recentDay,true).then(data=>{
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
                        }
                    }
                    else{ // Nếu share được chọn k phải là ownshare
                        if (this.recentTime[0].recentDay !== 0){ // Nếu có ngày gần nhất có dữ liệu
                        // Lấy dữ liệu với tham số ngày truyền vào 
                        
                            this.chartCtrl.getDailyData(id,this.recentTime[0].recentDay,true).then(data=>{
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
                        // Nếu chưa có ngày gần nhất có dữ liệu
                        else {
                            // Lấy dữ liệu ngày gần nhất
                            // this.chartCtrl.getLastDailyData(id,true).then(data=>{
                            //     if (data.length > 0){
                            //         this.recentTime[0].recentDay = data[0][0]; // Gán ngày gần nhất
                            //         this.chart.addSeries({   
                            //             id: id,
                            //             data: data,
                            //             name: name,
                            //             // color: this.color[this.sharesChart.length-1]
                            //             color: color,
                            //         }, true);
                            //     }
                            // });
                        }
                    }
                    
                }
            }
            else { 
                // Nếu Length > 5 full lựa chọn
                console.log("Full choose");
            }
        }
        else { // Nếu instrumentID đó đã có trong đồ thị, xoá.
            if (this.ownShare.length <= 1 ){ // Nếu số lượng ownshare <=1 
                if (this.sharesChart[this.getIndexShare(id)].isOwnShare == true ){
                    alert("Cannot delete this own share");
                }
                else{ // Nếu button chọn k phải là ownshare
                    
                    // Xóa màu được chọn
                    if ((this.sharesChart[this.getIndexShare(id)].color) !== null)
                        this.deleteColor(this.sharesChart[this.getIndexShare(id)].color);
                    // Lọc bỏ share có instrumentID = id
                    this.sharesChart = this.sharesChart.filter(function(el) {
                        return el.instrumentID !== id;
                    });
                    // Xóa line có instrumentID = id  trong đồ thị
                    if (this.chart.get(id) !== null) // Nếu id đó có trong đồ thị
                        this.chart.get(id).remove();
                    
                    // console.log(this.sharesChart[this.getIndexShare(id)].color);
                    
                    // this.colors[this.getIndexShare(id)].isSelected = false; 
                }
            }
            else{ // Nếu số lượng ownshare > 1
                // Giam count ownshare có trong charts
                if (this.sharesChart[this.getIndexShare(id)].isOwnShare == true ){
                    // this.countOwnShare--;
                    this.ownShare = this.ownShare.filter(function(el) {
                        return el.instrumentID != id;
                    });
                }
                // Xoá màu được chọn
                console.log(this.sharesChart[this.getIndexShare(id)].color);
                this.deleteColor(this.sharesChart[this.getIndexShare(id)].color);
                        
                // this.colors[this.getIndexShare(id)].isSelected = false; 
                // Lọc danh sách item được chọn
                this.sharesChart = this.sharesChart.filter(function(el) {
                    return el.instrumentID !== id;
                });
                // Xóa line được chọn
                // this.colors[this.getIndexShare(id)].isSelected = false; 
                // Xóa line
                if (this.chart.get(id) !== null)
                    this.chart.get(id).remove();
                console.log(this.ownShare);
                // Sort share
                this.ownShare.sort(function(a,b) {
                    return a.priority - b.priority;
                });
                
                if (this.recentTime[0].instrumentID === id && this.currentPeriod === 1) {
                    this.chartCtrl.getLastDailyData(this.ownShare[0].instrumentID,true)
                    .then(data=>{
                        if (data.length > 0 ){ // Nếu dữ liệu > 0
                            this.choose = true;
                            if (this.chartCtrl.getDay(this.recentTime[0].recentDay) === this.chartCtrl.getDay(data[0][0]))
                                {
                                    console.log("Dữ liêu cùng ngày ! ");
                                    this.recentTime[0].instrumentID = this.ownShare[0].instrumentID;
                                    this.recentTime[0].priority = this.ownShare[0].priority;
                                    console.log(this.recentTime);
                                } // Nếu ngày gần nhất giống ngày gần nhất của share cũ thì k làm gì
                            else{
                                // Nếu ngày gần nhất khác ngày gần nhất của share cũ thì gán lại giá trị, 
                                //     vẽ lại toàn bộ đồ thị với period như cũ
                                this.recentTime[0].recentDay = data[0][0];
                                this.recentTime[0].instrumentID = id;
                                this.recentTime[0].priority = priority;
                                // console.log(this.recentTime[0]);
                                // đã lấy được ngày gần nhất
                                changePeriod(this.currentPeriod);
                            }
                        }
                    }, true);
                }
                
            }
        } 
            
    }    
}
