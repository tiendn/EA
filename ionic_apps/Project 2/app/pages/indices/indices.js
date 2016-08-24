import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {MyProvider} from '../ProviderService/ProviderService';

@Component({
  providers: [MyProvider],
  templateUrl: 'build/pages/indices/indices.html',
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
