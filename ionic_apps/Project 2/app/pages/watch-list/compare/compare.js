import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the WatchListShareGraphComparePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/watch-list/compare/compare.html',
})
export class ComparePage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
