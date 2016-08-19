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
    this.provider = provider;

  }
  closeModal(){
    this.viewCtrl.dismiss();
  }

  ionViewLoaded(){
    var elm = document.getElementsByClassName("item-content")[0];
    let self = this;
    var top = 189;
    var bottom = 32;
    var something = 2 + 10;

    this.provider.getData().then(function(stories){
      console.log(window.innerHeight);
      self.data = stories;
      self.space = window.innerHeight -top-bottom-something - self.data.length*46 ;
      if (self.space > 0 ) {
        self.isEmpty = true;
        elm.style.bottom = self.space + 40 + 'px';
      }
      else{
        elm.style.bottom = 20;
      }
      console.log(self.space);
      console.log(self.data.length);
      self.loadDone = true;
    });

    // When rotate window
    window.addEventListener("orientationchange", function() {
      self.isEmpty = false;
      console.log(window.innerHeight);
      self.space = window.innerWidth -top-bottom-something - self.data.length*46 ;
      if (self.space > 0 ) {
        self.isEmpty = true;
        elm.style.bottom = self.space+50;
      }
      else{
        elm.style.bottom = 20;
      }
      console.log(self.space);
      console.log(self.data.length);
      self.loadDone = true;
    }, false);
  }
}
