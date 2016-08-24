import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {WatchlistProvider} from '../ProviderService/ProviderService';
@Component({
  providers : [WatchlistProvider],
  templateUrl: 'build/pages/watch-list/watch-list.html',
})
export class WatchListPage {

  static get parameters(){
    return [
      [WatchlistProvider],
      [ViewController]
    ]
  }
  constructor(WatchlistProvider,viewCtrl) {
    this.viewCtrl = viewCtrl;
    this.provider = WatchlistProvider ;
    this.data = [];
    this.loadDone = false;

  }
  ionViewLoaded(){
    let self = this;
    this.provider.getWatchListData()
    .then(function(stories) {
      self.data = stories;
      self.loadDone = true;
    });
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
}
