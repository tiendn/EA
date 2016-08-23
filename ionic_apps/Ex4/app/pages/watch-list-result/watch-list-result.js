import { Component } from '@angular/core';
import {MyProvider} from '../ProviderService/ProviderService';
import {ViewController} from 'ionic-angular';
@Component({
  providers :[MyProvider],
  templateUrl: 'build/pages/watch-list-result/watch-list-result.html'
})
export class WatchListResultPage {
  static get parameters() {
    return [
      [MyProvider],
      [ViewController]
    ];
  }

  constructor(provider,viewCtrl,platform) {
    this.viewCtrl = viewCtrl; // View control de close khi bam button /
    this.data = []; // Data
    this.loadDone = false; // Kiem tra nap xong data chua , nap xong thi hien dong chu
    this.provider = provider; // Provider tu cung cap
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }

  ionViewLoaded(){
    let self = this;
    this.provider.getData().then(function(stories){
      self.data = stories;
      self.loadDone = true;
    });
  }
}
