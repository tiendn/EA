import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {MyProvider} from '../ProviderService/ProviderService';
@Component({
  providers : [MyProvider],
  templateUrl: 'build/pages/watch-list/watch-list.html',
})
export class WatchListPage {

  static get parameters(){
    return [
      [MyProvider],
      [ViewController]
    ]
  }
  constructor(provider,viewCtrl) {
    this.viewCtrl = viewCtrl;
    this.provider = provider ;
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
