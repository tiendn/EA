
import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import {ChartsPage} from '../charts/charts';
import { PerformancePage} from '../performance/performance';
import { ComparePage} from '../compare/compare';

@Component({
  templateUrl: 'build/pages/watch-list/watch-list/watch-list.html',
})
export class WatchListPage {
  static get parameters() {
    return [
      [ViewController],
      [NavParams]
    ];
  }
  constructor(viewCtrl,NavParams) {
    this.navParam = NavParams;
    // this.iconType = ['irapp-watchlist','irapp-indices'];
    // if (this.navParam.get("type") === "watchlist") {
    //   this.titleType = ['Watchlist'];
    // }
    // else if (this.navParam.get("type") === "indices"){
    //   this.titleType = ['Indices'];
      
    // }
    // console.log(this.titleType);
    this.type = this.navParam.get("type");
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