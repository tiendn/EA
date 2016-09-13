import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
// import {WatchListPage} from '../watch-list/watch-list-Investment-Calculator/watch-list';
import{IndicesPage} from '../indices/Indices-Investment-Calculator/indices';
import {WatchListPage} from '../watch-list/watch-list/watch-list';
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
    let watchListModal = this.modalCtrl.create(WatchListPage,{type: "Watchlist"});
    watchListModal.present();
  }
  openIndices(){
    let indicesModal = this.modalCtrl.create(WatchListPage ,{type: "Indices"}); //
    indicesModal.present();
  }
}
