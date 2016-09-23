
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
                "instrumentID" : 0
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
        // Array Object các share được chọn vẽ lên chart
        this.sharesChart = [
            {
                "instrumentID":32940,
                "shareName":'SHR1',
                "color" : '#e27a8d',
                "isOwnShare" : true
            }
           
        ];
        // this.color = ["white","blue","green","orange","yellow"];
        // Danh sách các ownshare.
        this.listOwnShares = [
            {
                "instrumentID": 32940,
                "shareName":'SHR1',
                // "name" : "SHARE1",
                "color" : '#e27a8d',
                "priority" : 1
            },
            {
                "instrumentID": 32864,
                "shareName":'SHR2',
                //  "name" : "SHARE2",
                "color" : 'pink',
                "priority" : 2
            },
            {
                "instrumentID": 70003,
                "shareName":'LSHR',
                //  "name" : "LONGSHARE",
                "color" : '#388733',
                "priority" : 3
            }
        ]
        // Danh sách các share
        this.watchListShare = [
            {
                "instrumentID" : 16569,
                "shareName" : 'TICR1',
                "color": 'white'
            },
            {
                "instrumentID" : 39083,
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
                // if (this.currentPeriod === 1 )
                    // Nếu period mặc định đầu tiên được chọn là 1 thì lấy giá trị recentDay
                    // this.recentDay = data[0][0];
                // Thêm dữ liệu ban đầu
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
        // Load lại dữ liệu
        for (let i = 0 ; i < this.sharesChart.length ; i++){
            this.chartCtrl.getHistoryData(this.sharesChart[i].instrumentID,this.currentPeriod,true).then(data=>{
                if (data.length > 0 ){
                    this.chart.addSeries({   
                        id : this.sharesChart[i].instrumentID,    
                        name: this.sharesChart[i].shareName,              
                        data: data,
                        color: this.sharesChart[i].color
                    }, true); 
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
        // let index = -1; // chọn được Ownshare nào để lấy date cho các share khác hay chưa
        // //  Cách ngắt trong js.....
        // for (let i = 0 ; i < this.sharesChart.length ; i++){
        //     // console.log(this.sharesChart[i].isOwnShare);    
        //     if (this.sharesChart[i].isOwnShare === true){
        //         if (index !== -1 ) break; // Nếu chọn được rồi dừng vòng lặp
        //         // Lấy dữ liệu ngày gần nhất
        //         this.chartCtrl.getLastDailyData(this.sharesChart[i].instrumentID,true).then(data=>{
        //             if (data.length > 0 ){
        //                 // console.log(data[0][0]);
        //                 this.recentTime[0].recentDay = data[0][0];
        //                 console.log(this.recentTime[0].recentDay);
        //                 this.recentTime[0].instrumentID = this.sharesChart[i].instrumentID;
        //                 // this.recentDay = data[0][0]; // Lấy ngày gần nhất có dữ liệu
        //                 this.chart.addSeries({   
        //                     id : this.sharesChart[i].instrumentID,    
        //                     name: this.sharesChart[i].shareName,              
        //                     data: data,
        //                     // color: this.color[this.sharesChart.length]
        //                     color:  this.sharesChart[i].color
        //                 }, true);
        //                 index = i; // đã chọn được ownshare để lấy ngày
        //             }
        //         });
        //     }
        // }
        // //  truyền chưa đúng tham số , chưa nhận kết quả của recentDay.
        // console.log(this.recentTime[0].recentDay);
        // // console.log(index);
        // console.log(this.sharesChart);
        // // Vẽ lại data của các share khác
        // for (let i = 0 ; i < this.sharesChart.length ; i++){    
        //     if (i !== index){
        //         this.chartCtrl.getDailyData(this.sharesChart[i].instrumentID,this.recentTime[0].recentDay,true).then(data=>{
        //             if (data.length > 0 ){ // Kiểm tra nếu data k có dữ liệu thì k thêm vào 
        //                 this.chart.addSeries({   
        //                     id : this.sharesChart[i].instrumentID,    
        //                     name: this.sharesChart[i].shareName,              
        //                     data: data,
        //                     // color: this.color[this.sharesChart.length]
        //                     color:  this.sharesChart[i].color
        //                 }, true);
        //             }
        //         });
        //     }
        // }  
        var arr = this.sharesChart.slice();
        let index = -1;
        var $scope = this;
        getShareData(arr,index);
        function getShareData(arr,index){
            if (arr.length > 0 ){
                let share = arr[0];
                arr = arr.slice(1);
                if (share.isOwnShare){
                    $scope.chartCtrl.getLastDailyData(share.instrumentID,true).then(data=>{
                        if (data.length > 0 ){
                            // console.log(data[0][0]);
                            $scope.recentTime[0].recentDay = data[0][0];
                            console.log($scope.recentTime[0].recentDay);
                            $scope.recentTime[0].instrumentID = share.instrumentID;
                            // this.recentDay = data[0][0]; // Lấy ngày gần nhất có dữ liệu
                            $scope.chart.addSeries({   
                                id : share.instrumentID,    
                                name: share.shareName,              
                                data: data,
                                // color: this.color[this.sharesChart.length]
                                color:  share.color
                            }, true);
                            // index = i; // đã chọn được ownshare để lấy ngày
                            for (let i = 0 ; i < arr.length ; i++){    
                                // if (i !== index){
                                $scope.chartCtrl.getDailyData(arr[i].instrumentID,$scope.recentTime[0].recentDay,true).then(data=>{
                                    if (data.length > 0 ){ // Kiểm tra nếu data k có dữ liệu thì k thêm vào 
                                        $scope.chart.addSeries({   
                                            id : arr[i].instrumentID,    
                                            name: arr[i].shareName,              
                                            data: data,
                                            // color: this.color[this.sharesChart.length]
                                            color:  arr[i].color
                                        }, true);
                                    }
                                });
                                // }
                            }  
                        }
                        else {
                            index++;
                            getShareData(arr,index);
                        }
                    });
                }
            }

            // Get phan tu dau tien

            // Get data
            // De quy

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
    // Nhận share và vẽ lên đồ thị
    getChartData(id,name,color,priority,bool){
        if (this.getIndexShare(id) === -1){ // Nếu instrumentID đó chưa có trong danh sách được vẽ lên
            if (this.sharesChart.length < 5){ // Nếu số item được chọn < 5
                // Đẩy share vào danh sách chọn
                this.sharesChart.push({instrumentID: id, shareName : name, color : color, isOwnShare : bool});
                if (bool === true){
                    this.ownShare.push({instrumentID: id,priority: priority});
                    this.ownShare.sort(function(a,b) {
                        return a.priority - b.priority;
                    });
                }

                    
                // Nếu là ownshare thì tăng số lượng this.countOwnShare
                // if (bool === true ) this.countOwnShare += 1;
                // Nếu đang chọn != 1D
                if (this.currentPeriod !== 1){
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
                    // Kiem tra xem trong mang object da co ownshare chua, neu co thi lay recentDay
                    // Neu chua thay, gan gia tri cho recentday
                    // for (let i = 0 ; i < this.sharesChart.length ; i++){
                    //     if (this.sharesChart[i].isOwnShare === true)
                    // }
                    // console.log(this.recentDay);
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
                        this.chartCtrl.getLastDailyData(id,true).then(data=>{
                            if (data.length > 0){
                                this.recentTime[0].recentDay = data[0][0]; // Gán ngày gần nhất
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
                    // Lọc bỏ share có instrumentID = id
                    this.sharesChart = this.sharesChart.filter(function(el) {
                        return el.instrumentID !== id;
                    });
                    // Xóa line có instrumentID = id  trong đồ thị
                    if (this.chart.get(id) !== null) // Nếu id đó có trong đồ thị
                        this.chart.get(id).remove();
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
                // Lọc danh sách item được chọn
                this.sharesChart = this.sharesChart.filter(function(el) {
                    return el.instrumentID !== id;
                });
                // Xóa line được chọn
                if (this.chart.get(id) !== null)
                    this.chart.get(id).remove();
                // this.choose = false; // Biến kiểm tra lấy được ngày gần nhất hay chưa
                // Cần phải lưu một biến có giá trị lưu xem ownshare nào đang được lựa chọn để lấy recentDay
                console.log(this.ownShare);
                // Sort share
                // this.ownShare.slice(0);
                this.ownShare.sort(function(a,b) {
                    return a.priority - b.priority;
                });
                if (this.recentTime[0].instrumentID === id) {
                    this.chartCtrl.getLastDailyData(this.ownShare[0].instrumentID,true)
                    .then(data=>{
                        if (data.length > 0 ){ // Nếu dữ liệu > 0
                            // alert(2);
                            this.choose = true;// Lỗi không biết tại sao choose = true k nhận , có thể nhảy của JS
                            // console.log(this.recentTime[0].recentDay);
                            if (this.chartCtrl.getDay(this.recentTime[0].recentDay) === this.chartCtrl.getDay(data[0][0]))
                                {
                                    console.log("Dữ liêu cùng ngày ! ");
                                    this.recentTime[0].instrumentID = this.ownShare[0];
                                } // Nếu ngày gần nhất giống ngày gần nhất của share cũ thì k làm gì
                            else{
                                // Nếu ngày gần nhất khác ngày gần nhất của share cũ thì gán lại giá trị, 
                                //     vẽ lại toàn bộ đồ thị với period như cũ
                                this.recentTime[0].recentDay = data[0][0];
                                
                                this.recentTime[0].instrumentID = id;
                                console.log(this.recentTime[0]);
                                // đã lấy được ngày gần nhất
                                changePeriod(this.currentPeriod);
                            }
                            // console.log(choose);
                        }
                    }, true);
                }
                // Nếu id bị xoá là instrumentID đang được chọn để lấy recentday
                    // for (let i = 0 ; i < this.sharesChart.length ; i++){
                    //     console.log(this.sharesChart[i]);
                    //     if (this.sharesChart[i].isOwnShare === true && this.choose === false){ // Nếu là ownshare 
                    //         console.log(this.choose);
                    //         if (this.choose === true) break; // Nếu đã có ngày gần nhất
                    //         else {
                    //             console.log(this.sharesChart[i].instrumentID);
                    //             this.chartCtrl.getLastDailyData(this.sharesChart[i].instrumentID,true)
                    //             .then(data=>{
                    //                 if (data.length > 0 ){ // Nếu dữ liệu > 0
                    //                     // alert(2);
                    //                     this.choose = true;// Lỗi không biết tại sao choose = true k nhận , có thể nhảy của JS
                    //                     // console.log(this.recentTime[0].recentDay);
                    //                     if (this.chartCtrl.getDay(this.recentTime[0].recentDay) === this.chartCtrl.getDay(data[0][0]))
                    //                         {} // Nếu ngày gần nhất giống ngày gần nhất của share cũ thì k làm gì
                    //                     else{
                    //                         // Nếu ngày gần nhất khác ngày gần nhất của share cũ thì gán lại giá trị, 
                    //                         //     vẽ lại toàn bộ đồ thị với period như cũ
                    //                         this.recentTime[0].recentDay = data[0][0];
                    //                         console.log(this.recentTime[0].recentDay);
                    //                         this.recentTime[0].instrumentID = id;
                    //                         // đã lấy được ngày gần nhất
                    //                         changePeriod(this.currentPeriod);
                    //                     }
                    //                     // console.log(choose);
                    //                 }
                    //             }, true);
                    //         }
                            
                    //     }
                    // }
            
            /**
             * Có thể đưa thêm thuộc tính ưu tiên khi click ownshare .
             * Sau đó load vào mảng ownShare
             * Cứ sau mỗi lần thêm hoặc xóa, thì cập nhật lại vị trí . theo thuộc tính đó. 
             */
                    
            }
        } 
            
    }    
}
