import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {WatchListPage} from '../watch-list/watch-list';
import{IndicesPage} from '../indices/indices';
@Component({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {
  static get parameters() {
      return[
        [NavController],
        [ModalController]
      ];
  }
  constructor(nav,modal){
    this.nav = nav;
    this.modalCtrl = modal;

  }
  openWatchList(){
    let watchListModal = this.modalCtrl.create(WatchListPage);
    watchListModal.present();
  }
  openIndices(){
    let watchListModal = this.modalCtrl.create(IndicesPage);
    watchListModal.present();
  }
}
