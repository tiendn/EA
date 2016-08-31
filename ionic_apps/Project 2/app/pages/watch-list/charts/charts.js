
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
// import { PerformancePage} from '../performance/performance';
// import { ComparePage} from '../compare/compare';

@Component({
  templateUrl: 'build/pages/watch-list/charts/charts.html',
})
export class ChartsPage {
  static get parameters() {
    return [
      [ViewController]
    ];
  }
  constructor(viewCtrl) {
    this.viewCtrl = viewCtrl;
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  ionViewLoaded(){
    // $(function () {
            var chart = new Highcharts.Chart({
                chart : {
                  renderTo : 'charts',
                  type     : 'line'
                },
                title: {
                    text: 'Column chart with negative values'
                },
                xAxis: {
                    categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'John',
                    data: [5, 3, 4, 7, 2]
                }, {
                    name: 'Jane',
                    data: [2, -2, -3, 2, 1]
                }, {
                    name: 'Joe',
                    data: [3, 4, 4, -2, 5],
                }]
            });
        // });    
        chart.addSeries({                        
    name: 'Monkey',
    data: [2, -5, -3, 20, 1]
}, true);
chart.redraw();
    
  }

}
