import {Component} from '@angular/core';
import { ToastController } from 'ionic-angular';
import {JsonPipe} from '@angular/common';
import {Http} from "@angular/http";
import {DataService} from '../DataService/DataService';
import {StartedPipe} from '../PipeService/myPipe';
@Component({
  // If use pipes, don't load templateUrl
  templateUrl: 'build/pages/home/home.html',
  providers: [DataService],
  // Directive
    // selector: 'list-prItem',
  // Pipe
  // template: `
  // <ion-content padding class="getting-started">
  //   <ion-list>
  //     <ion-item text-wrap *ngFor="let story of stories ">
  //       <h2> {{story.prTitle | myPipe}}</h2>
  //     </ion-item>
  //   </ion-list>
  // </ion-content>
  // `,
  // pipes:[StartedPipe]
})

export class HomePage {

  static get parameters() {
      return[
        [ToastController],
        [DataService]
      ];
  }
  // var data;
    constructor(toastController, dataService){
      var stories = [];
      let self = this;
      dataService.getData().then(function(data){
        self.stories = data;
      });
      // console.log(this.stories);
      this.dateOfBirthday = new Date(1988, 4, 15);
      this.toastController = toastController;
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
