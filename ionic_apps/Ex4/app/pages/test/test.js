import { Component } from '@angular/core';
import {ToastController} from 'ionic-angular';
import {PopoverPage} from './PopoverPage';
/*
  Generated class for the TestPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/test/test.html',
})
export class TestPage {
  static get parameters(){
    return [
      [ToastController]
    ]
  }

  constructor(ToastController) {
    this.toastCtrl = ToastController;

  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000,
      position: 'bottom',
      showCloseButton: 'true',
      closeButtonText : "Close"
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}
}
