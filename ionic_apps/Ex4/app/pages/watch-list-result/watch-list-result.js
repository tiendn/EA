import { Component } from '@angular/core';
import {MyProvider} from '../ProviderService/ProviderService';
import {ViewController,Platform} from 'ionic-angular';
@Component({
  providers :[MyProvider],
  templateUrl: 'build/pages/watch-list-result/watch-list-result.html'
})
export class WatchListResultPage {
  static get parameters() {
    return [
      [MyProvider],
      [ViewController],
      [Platform]
    ];
  }

  constructor(provider,viewCtrl,platform) {
    this.platform = platform;
    this.viewCtrl = viewCtrl;
    this.isEmpty = false;
    this.data = [];
    this.loadDone = false;
    let self = this;
    var top = 189;
    var bottom = 32;
    var something = 23;
    provider.getData().then(function(stories){
      self.data = stories;
      self.space = window.innerHeight -top-bottom-something - self.data.length*44 ;
      if (self.space > 0 ) self.isEmpty = true;
      // console.log(self.space);
      // console.log(self.data.length);
      self.loadDone = true;
    });
    // console.log(window.innerHeight);
    // When rotate window
    window.addEventListener("orientationchange", function() {
      self.space = window.innerWidth -top-bottom-something - self.data.length*44*2 ;
      if (self.space > 0 ) self.isEmpty = true;
      // console.log(self.space);
      // console.log(self.data.length);
      self.loadDone = true;
    }, false);
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
}
