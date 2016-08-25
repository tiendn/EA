import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the WatchListShareGraphPerformancePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/watch-list/watch-list-share-graph-performance/watch-list-share-graph-performance.html',
})
export class WatchListShareGraphPerformancePage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
