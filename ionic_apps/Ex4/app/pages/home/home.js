import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Platform } from 'ionic-angular';
import {InfiniteScrollPage} from '../infinite-scroll/infinite-scroll';
import {ScrollHorizontalPage} from '../scroll-horizontal/scroll-horizontal';
@Component({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {
  static get parameters() {
      return[
        [Platform],
        [NavController]
      ];
  }
  constructor(platform,nav){
    this.nav = nav;
    // Co phai dang dung ipad landscape ?
    // De an? button
    this.isLandscape = false;
    this.platform = platform;

    if (this.platform.is('iphone') || this.platform.is('ipad')) {
      this.isHide = true;
      if (this.platform.isLandscape()){
        this.isHide = false;
        this.isLandscape = true;
      }
    }
  }
  showCard(){
    this.isHide = false;
  }
  infiniteScrollPage(){
    this.nav.push(InfiniteScrollPage);
  }
  scrollHorizontal(){
    this.nav.push(ScrollHorizontalPage);
  }
}
