import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {WatchListPage} from '../watch-list/watch-list-Investment-Calculator/watch-list';
import{IndicesPage} from '../indices/Indices-Investment-Calculator/indices';
import {WatchListShareGraphChartsPage} from '../watch-list/watch-list-share-graph-charts/watch-list-share-graph-charts';
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
    let watchListModal = this.modalCtrl.create(WatchListShareGraphChartsPage);
    watchListModal.present();
  }
  openIndices(){
    let watchListModal = this.modalCtrl.create(IndicesPage);
    watchListModal.present();
  }
}
