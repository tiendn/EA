import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import { Platform } from 'ionic-angular';
import {InfiniteScrollPage} from '../infinite-scroll/infinite-scroll';
import {ScrollHorizontalPage} from '../scroll-horizontal/scroll-horizontal';
import {WatchListResultPage} from '../watch-list-result/watch-list-result';
@Component({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {
  static get parameters() {
      return[
        [Platform],
        [NavController],
        [ModalController]
      ];
  }
  constructor(platform,nav,modal){
    this.nav = nav;
    // Co phai dang dung ipad landscape ?
    // De an? button
    this.isLandscape = false;
    this.platform = platform;
    this.modalCtrl = modal;
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
  openWatchList(){
    let watchListModal = this.modalCtrl.create(WatchListResultPage);
    watchListModal.present();
    // this.nav.push(WatchListResultPage);
  }
}
