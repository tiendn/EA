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
    // this.currentRotate = [{1:'landscape',2:'portrait'}];
    this.platform = platform; // platform hien tai.
    this.viewCtrl = viewCtrl; // View control de close khi bam button /
    this.isEmpty = false; // Kiem tra co khoang trong o giua ion-list va dong chu o duoi
    this.data = []; // Data
    this.loadDone = false; // Kiem tra nap xong data chua , nap xong thi hien dong chu
    this.provider = provider; // Provider tu cung cap
    this.isPortrait = true; // Co phai man hinh hien tai la porttrait
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }

  ionViewLoaded(){
    // var elm = document.getElementsByClassName("item-content")[0]; // Lay doi tuong class item-content (ion-list)
    // var footer = document.getElementsByClassName("footer")[0];
    let self = this;
    // var top = 189; // distance from top
    // var bottom = 40; // distance from botton
    // var something = 2 + 10; // 2: Khoang cach giua Hang Close vaf hang duoi
//  10 la khoang cach giua ion-list voi dong chu o duoi
    this.provider.getData().then(function(stories){
      // console.log(window.innerHeight);
      self.data = stories;
      // self.space = window.innerHeight -top-bottom-something - self.data.length*46 ;
      // if (self.platform.isLandscape()) self.isPortrait = false;
      // if (self.space > 0 ) {
        // self.isEmpty = true;
        // elm.style.bottom = self.space + 40 + 'px';
      // }
      // else{
        // elm.style.bottom = 40+ 'px';
      // }
      // console.log(self.space);
      console.log(self.data.length);
      self.loadDone = true;
    });
// Dat bien lay trang thai dang la man hinh landscape hay portrait.
    // When rotate window
    // window.addEventListener("orientationchange", function() {
    //
    //   self.isEmpty = false;
    //   console.log(window.innerHeight);
    //   self.space = window.innerHeight -top-bottom-something - self.data.length*46 ;
    //   if (self.space > 0 ) {
    //     self.isEmpty = true;
    //     if (isPortrait){
    //       console.log("portrait before");
    //       if (self.platform.isLandscape()){
    //         elm.style.bottom = self.space - 30 + 'px';
    //       }
    //       else if (self.platform.isPortrait()){
    //         elm.style.bottom = self.space + 40 + 'px';
    //       }
    //       self.isPortrait = false;
    //     }
    //     else {
    //       console.log("landscape before");
    //       if (self.platform.isLandscape()){
    //         elm.style.bottom = self.space - 30 + 'px';
    //       }
    //       else if (self.platform.isPortrait()){
    //         elm.style.bottom = self.space  + 'px';
    //       }
    //       self.isPortrait = true;
    //     }
    //     footer.style.bottom = self.space-5 +'px';
    //   }
    //   else{
    //     elm.style.bottom = 40+ 'px';
    //     footer.style.bottom = 0 +'px';
    //   }
    //   console.log(self.space);
    //   console.log(self.data.length);
    //   self.loadDone = true;
    //
    // }, false);
  }
}
