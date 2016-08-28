import { Component } from '@angular/core';
import {  } from 'ionic-angular';
import {MyProvider } from '../../ProviderService/ProviderService';
import {FormatNumber} from '../../PipeService/formatnumber';
@Component({
  providers: [MyProvider],
  pipes: [FormatNumber],
  templateUrl: 'build/pages/watch-list/compare/compare.html',
})
export class ComparePage {
  static get parameters() {
    return [[MyProvider]];
  }

  constructor(provider) {
    this.data = [];
    this.provider = provider;
  }
  ionViewLoaded(){
    let self = this;
    this.provider.getWatchListCompareData()
    .then(data => {
      self.data = data;
    })
  }
}
