import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ToastController } from 'ionic-angular';
import {TestProviderPage} from '../test-provider/test-provider';
import {TestPipePage} from '../test-pipe/test-pipe';
import {TestDirectivePage} from '../test-directive/test-directive';
@Component({
  templateUrl: 'build/pages/home/home.html',
})

export class HomePage {

  static get parameters() {
      return[
        [ToastController],
        [NavController]
      ];
  }
  constructor(toastController,navController){
    this.nav = navController;
    this.toastController = toastController;
  }
  // presentToast() {
  //  let toast = this.toastController.create({
  //    message: 'User was added successfully',
  //    duration: 3000
  //  });
  //  toast.present();
  // }

  myFunction(type){
    if (type == 1)
      this.nav.push(TestProviderPage);
    if (type == 2)
      this.nav.push(TestPipePage);
    if (type == 3)
      this.nav.push(TestDirectivePage);
  }
}
