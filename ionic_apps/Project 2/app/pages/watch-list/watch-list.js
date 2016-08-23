import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {}
@Component({
  templateUrl: 'build/pages/watch-list/watch-list.html',
})
export class WatchListPage {
  static get parameters() {
    return [[ViewController]];
  }

  constructor(viewCtrl) {
    this.viewCtrl = view;
  }
}
