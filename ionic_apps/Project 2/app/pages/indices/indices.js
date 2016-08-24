import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {IndicesProvider} from '../ProviderService/ProviderService';

@Component({
  Providers: [IndicesProvider],
  templateUrl: 'build/pages/indices/indices.html',
})
export class IndicesPage {
  static get parameters() {
    return [
      [ViewController],
      [IndicesProvider]
    ];
  }

  constructor(viewCtrl,provider) {
    this.viewCtrl = viewCtrl;
    this.provider = provider;
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
