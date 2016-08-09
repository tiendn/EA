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
        [ToastController],
        [GetData]
      ];
  }
  // var data;
    constructor(toastController,data){
      // this.data = data.getData();
      console.log(data.getData());
      // var stories = [];
      // http.get('./prdata.json').map(res => res.json()).subscribe(
      //   data => {
      //     this.stories = data;
      //     console.log(this.stories);
      //   },
      //     err => {
      //     console.log("Oops!");
      //   }
      // );
      // console.log(this.stories);
      this.dateOfBirthday = new Date(1988, 4, 15);
      this.toastController = toastController;
      // retrieveData();
    }

    // retrieveData(){
    //   this.http.get('./prdata.json').subscribe(data => {
    //     this.data = data;
    //   });
    // }
    // getData(){
    //   console.log(this.data);
    //   return this.data;
    // }
    presentToast() {
     let toast = this.toastController.create({
       message: 'User was added successfully',
       duration: 3000
     });
     toast.present();
 }


}
