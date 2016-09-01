
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ChartServices} from '../../ProviderService/chart-services';
import { MyProvider } from '../../ProviderService/chart-services';
@Component({
    providers:[ChartServices],
    // providers: [MyProvider],
    templateUrl: 'build/pages/watch-list/charts/charts.html',
})
export class ChartsPage {
  static get parameters() {
    return [
      [ViewController],
      [ChartServices],
    //   [MyProvider]
    ];
  }
  constructor(viewCtrl,chartServices) {
    this.viewCtrl = viewCtrl;
    this.chartCtrl = chartServices;
    // this.provider = provider;
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  ionViewLoaded(){
    //   this.provider.get
    //   chartCtrl.getHistoryData(16569,)
            var chart = new Highcharts.Chart({
                colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', 
                '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
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
                series: [{
                    name: 'John',
                    data: [5, 3, 4, 7, 2,5,5,7,2,5,3,5,2,6,4,5]
                }, {
                    name: 'Jane',
                    data: [2, -2, -3, 2, 1]
                }, {
                    name: 'Joe',
                    data: [3, 4, 4, -2, 5],
                }]
            });
        // });    
        //         chart.addSeries({                        
        //     name: 'Monkey',
        //     data: [2, -5, -3, 20, 1]
        // }, true);
        // chart.redraw();
    
  }

}
