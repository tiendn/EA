import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/watch-list/performance/performance.html',
})
export class PerformancePage {
  static get parameters() {
    return [[ViewController]];
  }
  constructor(viewCtrl) {
    this.viewCtrl = viewCtrl;
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
}
