import { Component } from '@angular/core';
import {MyProvider} from '../ProviderService/ProviderService';
import {ViewController} from 'ionic-angular';

@Component({
  providers :[MyProvider],
  templateUrl: 'build/pages/watch-list-result/watch-list-result.html',
})
export class WatchListResultPage {
  static get parameters() {
    return [[MyProvider],[ViewController]];
  }

  constructor(provider,viewCtrl) {
    this.viewCtrl = viewCtrl;
    this.data = [];
    let self = this;
    provider.getData().then(function(stories){
      self.data = stories;
    });
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
}
