
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {ChartsPage} from '../charts/charts';
import { PerformancePage} from '../performance/performance';
import { ComparePage} from '../compare/compare';

@Component({
  templateUrl: 'build/pages/watch-list/watch-list/watch-list.html',
})
export class WatchListPage {
  static get parameters() {
    return [
      [ViewController]
    ];
  }
  constructor(viewCtrl) {
    this.viewCtrl = viewCtrl;
    this.chartsTab = ChartsPage;
    this.compareTab = ComparePage;
    this.performanceTab = PerformancePage;
    this.HTMLContent = ['Watchlist ','From','To','Change','Change %',
    ];
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
}
// @Component({
//   template : '  <ion-content> <h1> Hello Monkey </h1> </ion-content>'
// })
// export class chartsTab{
//   constructor(){}
// }
