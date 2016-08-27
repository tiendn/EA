
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
}
