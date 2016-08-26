
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { PerformancePage} from '../performance/performance';
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
    this.performanceTab = PerformancePage;
    this.HTMLContent = ['Watchlist ','From','To','Change','Change %',
    'All share data is presented in the currency of your choice. Configure via ','setting'];
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
}
