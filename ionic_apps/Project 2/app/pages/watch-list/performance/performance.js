import { Component } from '@angular/core';
import {  NavParams} from 'ionic-angular';
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
      [NavParams],
      [MyProvider]
    ]
  }
  constructor(NavParams,provider) {
    this.data = [];
    this.navParam = NavParams;
    this.provider = provider;
    this.itemHeader = ['6M','52W','YTD'];
  }
  
  ionViewLoaded(){
    let self = this;
    if (this.navParam.data === "Watchlist"){
        this.provider.getWatchListPerformanceData()
          .then(data => {
            self.data = data;
          });
    }
    else if (this.navParam.data === "Indices"){
        this.provider.getIndicesPerformanceData()
          .then(data => {
            self.data = data;
          });
    }
    
  }
}
