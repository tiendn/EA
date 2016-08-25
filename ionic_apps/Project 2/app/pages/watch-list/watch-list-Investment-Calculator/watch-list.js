import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {MyProvider} from '../../ProviderService/ProviderService';
import {FormatNumber} from '../../PipeService/formatnumber';
@Component({
  providers : [MyProvider],
  pipes:[FormatNumber],
  templateUrl: 'build/pages/watch-list/watch-list-Investment-Calculator/watch-list.html',
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
    this.HTMLContent = ['Watchlist ','From','To','Change','Change %',
    'All share data is presented in the currency of your choice. Configure via ','setting'];
    this.lastDate = '02/04/2015';
    this.currentDate = '02/04/2016';

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
