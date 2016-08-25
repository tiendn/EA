import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {MyProvider} from '../../ProviderService/ProviderService';
import {FormatNumber} from '../../PipeService/formatnumber';
@Component({
  providers: [MyProvider],
  pipes:[FormatNumber],
  templateUrl: 'build/pages/indices/Indices-Investment-Calculator/indices.html',
})
export class IndicesPage {
  static get parameters() {
    return [
      [ViewController],
      [MyProvider]
    ];
  }

  constructor(viewCtrl,provider) {
    this.viewCtrl = viewCtrl;
    this.provider = provider;
    this.HTMLContent = ['Watchlist ','From','To','Change','Change %'];
    this.lastDate = '02/04/2015';
    this.currentDate = '02/04/2016';
  }
  ionViewLoaded(){
    let self = this;
    this.provider.getIndicesData().then(stories => {
      self.data = stories;
    });
  };
  dismiss(){
    this.viewCtrl.dismiss();
  }
}
