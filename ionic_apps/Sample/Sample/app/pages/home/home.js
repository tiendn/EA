import {Component} from '@angular/core';
import { ToastController } from 'ionic-angular';
import {JsonPipe} from '@angular/common';
import {Http} from "@angular/http";
import {GetData} from './GetData/GetData';
@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [GetData]
})

export class HomePage {

  static get parameters() {
      return[
        [ToastController]
      ];
  }
  // var data;
    constructor(){

      this.data = GetData;
      console.log(this.data.getData());
      // var stories = [];

      this.dateOfBirthday = new Date(1988, 4, 15);
      this.toastController = ToastController;
      // retrieveData();
    }


    presentToast() {
     let toast = this.toastController.create({
       message: 'User was added successfully',
       duration: 3000
     });
     toast.present();
 }


}
