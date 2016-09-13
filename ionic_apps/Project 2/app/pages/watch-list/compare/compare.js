import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import {MyProvider } from '../../ProviderService/ProviderService';
import {FormatNumber} from '../../PipeService/formatnumber';
@Component({
  providers: [MyProvider],
  pipes: [FormatNumber],
  templateUrl: 'build/pages/watch-list/compare/compare.html',
})
export class ComparePage {
  static get parameters() {
    return [
      [MyProvider],
      [NavParams]
      ];
  }

  constructor(provider,NavParams) {
    this.data = [];
    this.navParam = NavParams;
    this.type = this.navParam.data;
    this.provider = provider;
    if (this.type === "Watchlist"){
        this.dateTitle = "TODAY";
    }
    else if (this.type === "Indices"){
        this.dateTitle = "END OF DAY";
    }
    this.currency = false;
  }
  ionViewLoaded(){
    let self = this;
    if (this.type === "Watchlist"){
      this.provider.getWatchListCompareData()
        .then(data => {
          self.data = data;
        });
      this.currency = true;
    }
    else if (this.type === "Indices"){
        this.provider.getIndicesCompareData()
          .then(data => {
            self.data = data;
          });
    }
    
  }
}
