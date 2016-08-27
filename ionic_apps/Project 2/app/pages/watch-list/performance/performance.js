import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {MyProvider} from '../../ProviderService/ProviderService';
import {FormatNumber} from '../../PipeService/formatnumber';
@Component({
  providers: [MyProvider],
  pipes:[FormatNumber],
  templateUrl: 'build/pages/watch-list/performance/performance.html',
})
export class PerformancePage {
  static get parameters(){
    return [
      [ViewController],
      [MyProvider]
    ]
  }
  constructor(viewCtrl,provider) {
    this.data = [];
    this.viewCtrl = viewCtrl;
    this.provider = provider;
    this.HTMLContent = ['Watchlist ','From','To','Change','Change %',
    'All share data is presented in the currency of your choice. Configure via ','setting'];
  }
  
  ionViewLoaded(){
    let self = this;
    this.provider.getWatchListPerformanceData()
    .then(data => {
      self.data = data;
    });
  }
}
