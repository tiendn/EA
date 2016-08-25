import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the WatchListShareGraphChartsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/watch-list/watch-list-share-graph-charts/watch-list-share-graph-charts.html',
})
export class WatchListShareGraphChartsPage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
    this.HTMLContent = ['Watchlist ','From','To','Change','Change %',
    'All share data is presented in the currency of your choice. Configure via ','setting'];
  }
}
